import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import {
  IInvoice,
  IInvoiceCounter,
  Invoice,
  InvoiceCounter,
  InvoiceType,
} from './invoice.schema';
import { InvoiceDto } from './dto/invoice.dto';
import { IService } from '../service/service.schema';
import { IItem } from '../item/item.schema';
import { GetInvoicesDto } from './dto/get-invoices.dto';
import { getFormattedDate } from 'src/utils/formatIsoDate';
import { ReqUserData } from '../user/interfaces/req-user-data.interface';
import { AccountingService } from '../accounting/accounting.service';
import { PayCustomerInvoicesDto } from './dto/pay-customer-invoices.dto';
import { ReportService } from '../report/report.service';
import { CustomerService } from '../customer/customer.service';
import { ServiceService } from '../service/service.service';
import { ItemService } from '../item/item.service';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectModel(Invoice.name)
    private invoiceModel: Model<IInvoice>,
    @InjectModel(InvoiceCounter.name)
    private invoiceCounterModel: Model<IInvoiceCounter>,
    private readonly servicesService: ServiceService,
    private readonly itemService: ItemService,
    private readonly customerService: CustomerService,
    private readonly accountingService: AccountingService,
    private readonly reportService: ReportService,
  ) {}

  async getAll(dto: GetInvoicesDto, user: ReqUserData) {
    const {
      pageIndex,
      search,
      pageSize,
      customerId,
      type,
      startDate,
      endDate,
    } = dto;

    const filter: FilterQuery<IInvoice> = { $and: [{ $or: [] }] };

    if (search) {
      // @ts-ignore
      filter.$and[0].$or.push({
        number: { $regex: search, $options: 'i' },
        driverName: { $regex: search, $options: 'i' },
        generalNote: { $regex: search, $options: 'i' },
        customerNote: { $regex: search, $options: 'i' },
      });
    }

    // for "specialAccess" user, only s1 invoices
    if (user.role === 'specialAccess') {
      // @ts-ignore
      filter.$and[0].$or.push({ type: 's1' });
    } else if (type) {
      // @ts-ignore
      filter.$and[0].$or.push({ type });
    }

    if (customerId) {
      // @ts-ignore
      filter.$and[0].$or.push({ customer: customerId });
    }

    // Add date range filter
    if (startDate || endDate) {
      const dateFilter: any = {};
      if (startDate) {
        dateFilter.$gte = startDate;
      }
      if (endDate) {
        const nextDay = new Date(endDate as string);
        nextDay.setDate(nextDay.getDate() + 1);
        dateFilter.$lt = getFormattedDate(nextDay);
      }
      // @ts-ignore
      filter.$and.push({ createdAt: dateFilter });
    }

    // If no filters were added to $or, remove it
    if (filter?.$and?.[0]?.$or?.length === 0) {
      filter.$and = filter.$and.slice(1);
    }

    // If no filters were added at all, use an empty filter to query all orders
    if (filter?.$and?.length === 0) {
      // @ts-ignore
      delete filter.$and;
    }

    const [invoices, totalCount, totalsResult] = await Promise.all([
      this.invoiceModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(pageIndex * pageSize)
        .limit(pageSize)
        .populate('customer')
        .populate('vehicle'),
      this.invoiceModel.countDocuments(filter),
      this.invoiceModel.aggregate([
        { $match: filter },
        {
          $group: {
            _id: null,
            totalInvoiceAmount: { $sum: '$accounting.totalUsd' },
            totalAmountPaid: { $sum: '$accounting.paidAmountUsd' },
            totalOutstandingAmount: {
              $sum: {
                $subtract: [
                  '$accounting.totalUsd',
                  '$accounting.paidAmountUsd',
                ],
              },
            },
          },
        },
      ]),
    ]);

    const totalPages = Math.ceil(totalCount / pageSize);

    const totals = totalsResult[0] || {
      totalCost: 0,
      totalPrice: 0,
      totalProfitOrLoss: 0,
    };

    return {
      invoices,
      totals,
      pagination: {
        pageIndex,
        pageSize,
        totalCount,
        totalPages,
      },
    };
  }

  async getAccountsRecievableSummary() {
    const invoices = await this.invoiceModel.aggregate([
      {
        $lookup: {
          from: 'customers',
          localField: 'customer',
          foreignField: '_id',
          as: 'customer',
        },
      },
      { $unwind: { path: '$customer', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          customerName: { $ifNull: ['$customer.name', 'Unknown Customer'] },
          invoiceAmount: '$accounting.totalUsd',
          amountPaid: '$accounting.paidAmountUsd',
          outstandingAmount: {
            $subtract: ['$accounting.totalUsd', '$accounting.paidAmountUsd'],
          },
        },
      },
      {
        $group: {
          _id: '$customerName',
          invoiceAmount: { $sum: '$invoiceAmount' },
          amountPaid: { $sum: '$amountPaid' },
          outstandingAmount: { $sum: '$outstandingAmount' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const rows = invoices.map((invoice) => ({
      customerName: invoice._id,
      invoiceAmount: invoice.invoiceAmount,
      amountPaid: invoice.amountPaid,
      outstandingAmount: invoice.outstandingAmount,
    }));

    const totals = rows.reduce(
      (acc, row) => {
        acc.totalInvoiceAmount += row.invoiceAmount;
        acc.totalAmountPaid += row.amountPaid;
        acc.totalOutstandingAmount += row.outstandingAmount;
        return acc;
      },
      {
        totalInvoiceAmount: 0,
        totalAmountPaid: 0,
        totalOutstandingAmount: 0,
      },
    );

    return { rows, totals };
  }

  async create(dto: InvoiceDto) {
    // items existance validation
    const updatedDto = await this.validateItemsExistanceAndUpdateDto(dto);

    // Generate invoice number
    const invoiceNumber = await this.generateInvoiceNumber(dto.type);

    const accounting = await this.accountingService.getAccounting();

    // Create new invoice
    const newInvoice = await this.invoiceModel.create({
      customer: updatedDto.customerId,
      vehicle: updatedDto.vehicleId,
      number: invoiceNumber,
      type: dto.type,
      customerNote: updatedDto.customerNote,
      accounting: {
        isPaid: updatedDto.isPaid,
        usdRate: accounting.usdRate,

        discount: updatedDto.discount,
        taxesUsd: updatedDto.taxesUsd,

        subTotalUsd: updatedDto.subTotalUsd,
        totalUsd: updatedDto.totalUsd,

        paidAmountUsd: updatedDto.paidAmountUsd,
      },
      items: updatedDto.items,
    });

    await this.doInvoiceEffects(updatedDto);

    const populatedInvoice = await this.invoiceModel
      .findById(newInvoice._id)
      .populate('customer')
      .populate('vehicle');

    return populatedInvoice;
  }

  async edit(invoiceId: string, dto: InvoiceDto) {
    await this.revertInvoiceEffects(invoiceId);

    // items existance validation
    const updatedDto = await this.validateItemsExistanceAndUpdateDto(dto);

    // Create new invoice
    await this.invoiceModel.findByIdAndUpdate(invoiceId, {
      customer: updatedDto.customerId,
      vehicle: updatedDto.vehicleId,
      type: dto.type,
      customerNote: updatedDto.customerNote,
      accounting: {
        isPaid: updatedDto.isPaid,

        discount: updatedDto.discount,
        taxesUsd: updatedDto.taxesUsd,

        subTotalUsd: updatedDto.subTotalUsd,
        totalUsd: updatedDto.totalUsd,

        paidAmountUsd: updatedDto.paidAmountUsd,
      },
      items: updatedDto.items,
    });

    await this.doInvoiceEffects(updatedDto);
  }

  async delete(invoiceId: string) {
    await this.revertInvoiceEffects(invoiceId);

    await this.invoiceModel.findByIdAndDelete(invoiceId);
  }

  /**
   * Applies a customer's payment towards their unpaid invoices.
   *
   * This method distributes the given payment amount across all of the customer's unpaid invoices,
   * starting from the oldest. It updates the `amountPaidUsd` and `isPaid` status of each invoice
   * based on how much of the invoice remains unpaid. Once the payment is exhausted, it stops processing.
   *
   * Additionally, it updates the accounting data:
   * - Increases the total income in the accounting system by the amount paid.
   * - Decreases the total customer loan by the amount paid.
   * - Updates the customer's individual loan.
   *
   * @param dto - Object containing:
   *   - `customerId`: MongoDB ID of the customer.
   *   - `amount`: Total payment amount in USD to apply.
   *
   * @throws {BadRequestException} If the customer does not exist.
   *
   * @returns {Promise<void>} Resolves when all updates are completed.
   */
  async payCustomerInvoices(dto: PayCustomerInvoicesDto) {
    const { customerId, amount: customerPaidAmount } = dto;

    // validate customer exists
    const customer = await this.customerService.getOneById(customerId);
    if (!customer) throw new BadRequestException('Customer not found');

    let remainingAmountThatCustomerPaidNow = customerPaidAmount;

    const unpaidInvoices = await this.invoiceModel
      .find({
        customer: customerId,
        'accounting.isPaid': false,
      })
      .sort({ createdAt: 1 });

    for (const invoice of unpaidInvoices) {
      const invoiceRemaining =
        invoice.accounting.totalUsd - invoice.accounting.paidAmountUsd;

      // if customer paid more than invoice remaining -> invoice is paid
      if (remainingAmountThatCustomerPaidNow >= invoiceRemaining) {
        invoice.accounting.paidAmountUsd += invoiceRemaining;
        invoice.accounting.isPaid = true;
        remainingAmountThatCustomerPaidNow -= invoiceRemaining;
      }
      // if customer paid less than invoice remaining -> invoice is not paid
      else {
        invoice.accounting.paidAmountUsd += remainingAmountThatCustomerPaidNow;
        invoice.accounting.isPaid = false;
        remainingAmountThatCustomerPaidNow = 0;
      }

      await invoice.save();

      if (remainingAmountThatCustomerPaidNow <= 0) break;
    }

    if (customerPaidAmount > 0) {
      // Decrease customer loan
      customer.loan = customer.loan - customerPaidAmount;
      await customer.save();

      // Update accounting
      await this.accountingService.updateAccounting({
        totalIncome: customerPaidAmount, // increase total income
        totalCustomersLoan: -customerPaidAmount, // decrease total customers loan
      });

      // update daily report
      await this.reportService.syncDailyReport({
        date: new Date(),
        totalIncome: customerPaidAmount,
      });
    }
  }

  private async doInvoiceEffects(updatedDto: InvoiceDto) {
    // decrease item quantity
    const items = updatedDto.items.filter((item) => !!item.itemRef);
    for (const item of items) {
      await this.itemService.updateItemQuantity(item.itemRef, -item.quantity);
    }

    // save customer loan if did not pay all
    const remainingAmount = updatedDto.totalUsd - updatedDto.paidAmountUsd;
    if (!updatedDto.isPaid && remainingAmount > 0) {
      const customer = await this.customerService.getOneById(
        updatedDto.customerId,
      );
      if (!customer) throw new BadRequestException('Customer not found');

      customer.loan = customer.loan + remainingAmount;
      await customer.save();

      // increase total customer loans
      await this.accountingService.updateAccounting({
        totalCustomersLoan: remainingAmount,
      });
    }

    // TODO: save product cost as expenses

    // update accounting
    await this.accountingService.updateAccounting({
      totalIncome: updatedDto.paidAmountUsd,
    });

    // update daily report
    await this.reportService.syncDailyReport({
      date: new Date(),
      totalIncome: updatedDto.paidAmountUsd,
    });
  }

  private async revertInvoiceEffects(invoiceId: string) {
    const invoice = await this.invoiceModel.findById(invoiceId).lean();
    if (!invoice) throw new NotFoundException('Invoice not found');

    // increase item quantity
    const items = invoice.items.filter((item) => !!item.itemRef);
    for (const item of items) {
      await this.itemService.updateItemQuantity(
        item.itemRef?.toString(),
        item.quantity,
      );
    }

    // decrease customer loan (in case isPaid is false)
    const remainingAmount =
      invoice.accounting.totalUsd - invoice.accounting.paidAmountUsd;
    if (!invoice.accounting.isPaid && remainingAmount > 0) {
      const customer = await this.customerService.getOneById(
        invoice.customer?.toString(),
      );
      if (!customer) throw new BadRequestException('Customer not found');

      customer.loan = customer.loan - remainingAmount;
      await customer.save();

      // decrease total customer loans
      await this.accountingService.updateAccounting({
        totalCustomersLoan: -remainingAmount,
      });
    }

    //TODO: revert saving product cost as expenses

    // decrease accounting total income
    await this.accountingService.updateAccounting({
      totalIncome: -invoice.accounting.paidAmountUsd,
    });

    // update daily report
    await this.reportService.syncDailyReport({
      date: invoice.createdAt,
      totalIncome: -invoice.accounting.paidAmountUsd,
    });
  }

  private async validateItemsExistanceAndUpdateDto(dto: InvoiceDto) {
    // Separate items and services from the provided DTO
    const itemRefs = dto.items
      .filter((item) => item.itemRef)
      .map((item) => item.itemRef);
    const serviceRefs = dto.items
      .filter((item) => item.serviceRef)
      .map((item) => item.serviceRef);

    let dbItems: IItem[] = [];
    let dbServices: IService[] = [];

    // Process items if there are any
    if (itemRefs.length > 0) {
      // get products from db
      dbItems = await this.itemService.getManyByIds(itemRefs);

      // make sure all items are valid
      if (dbItems.length !== itemRefs.length)
        throw new BadRequestException('Some items are not valid');

      // override the dto items array to add product fields for later reference
      dto.items = dto.items.map((item) => {
        const product = dbItems.find(
          (product) => product._id.toString() === item.itemRef,
        );
        if (product) {
          return {
            ...item,
            name: product.name,
            cost: product.cost,
            price: product.price,
          };
        }
        return item;
      });
    }

    // Process services if there are any
    if (serviceRefs.length > 0) {
      // get services from db
      dbServices = await this.servicesService.getManyByIds(serviceRefs);

      // make sure all services are valid
      if (dbServices.length !== serviceRefs.length)
        throw new BadRequestException('Some services are not valid');

      // override the dto items array to add service fields for later reference
      dto.items = dto.items.map((item) => {
        const service = dbServices.find(
          (service) => service._id.toString() === item.serviceRef,
        );
        if (service) {
          return {
            ...item,
            name: service.name,
            price: service.price,
          };
        }
        return item;
      });
    }

    return dto;
  }

  private async generateInvoiceNumber(type: InvoiceType) {
    const currentYear = new Date().getFullYear();

    // Increment the counter specific to the year & type
    const updatedCounter = await this.invoiceCounterModel.findOneAndUpdate(
      { year: currentYear, type },
      { $inc: { seq: 1 } },
      { new: true, upsert: true },
    );

    // Ensure two-digit sequence
    const paddedSeq = String(updatedCounter.seq).padStart(2, '0');

    return type === 's2'
      ? `s2${currentYear}${paddedSeq}`
      : `${currentYear}${paddedSeq}`;
  }
}
