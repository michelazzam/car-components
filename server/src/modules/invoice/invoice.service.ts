import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  IInvoice,
  IInvoiceCounter,
  Invoice,
  InvoiceCounter,
  InvoiceType,
} from './invoice.schema';
import {
  InvoiceDto,
  InvoiceDtoWithItemsDetails,
  InvoiceItemWithDetails,
} from './dto/invoice.dto';
import { IService } from '../service/service.schema';
import { IItem } from '../item/item.schema';
import { GetInvoicesDto } from './dto/get-invoices.dto';
import { ReqUserData } from '../user/interfaces/req-user-data.interface';
import { AccountingService } from '../accounting/accounting.service';
import { PayCustomerInvoicesDto } from './dto/pay-customer-invoices.dto';
import { ReportService } from '../report/report.service';
import { CustomerService } from '../customer/customer.service';
import { ServiceService } from '../service/service.service';
import { ItemService } from '../item/item.service';
import { GetAccountsRecievableDto } from '../report/dto/get-accounts-recievable.dto';

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

  private async getInvoicesData(dto: GetInvoicesDto, user: ReqUserData) {
    const {
      search,
      customerId,
      vehicleId,
      type,
      startDate,
      endDate,
      itemId,
      isPaid,
      pageIndex,
      pageSize,
    } = dto;

    const pipeline: any[] = [];

    // Match by ObjectId before customer is replaced by lookup
    if (customerId) {
      pipeline.push({
        $match: {
          customer: new Types.ObjectId(customerId),
        },
      });
    }

    // Lookup to join customer data for search
    pipeline.push({
      $lookup: {
        from: 'customers', // make sure this is the correct collection name
        localField: 'customer',
        foreignField: '_id',
        as: 'customer',
      },
    });
    pipeline.push({
      $unwind: { path: '$customer', preserveNullAndEmptyArrays: true },
    });

    // Match by ObjectId before vehicle is replaced by lookup
    if (vehicleId) {
      pipeline.push({
        $match: {
          vehicle: new Types.ObjectId(vehicleId),
        },
      });
    }

    // Lookup to join vehicle data (if needed)
    pipeline.push({
      $lookup: {
        from: 'vehicles', // adjust collection name if different
        localField: 'vehicle',
        foreignField: '_id',
        as: 'vehicle',
      },
    });
    pipeline.push({
      $unwind: { path: '$vehicle', preserveNullAndEmptyArrays: true },
    });

    // Match stage
    const matchConditions: any[] = [];

    if (search) {
      const regex = { $regex: search, $options: 'i' };
      matchConditions.push({
        $or: [
          { number: regex },
          { driverName: regex },
          { generalNote: regex },
          { customerNote: regex },
          { 'customer.name': regex }, // search by customer name
        ],
      });
    }

    if (isPaid === 'true') {
      matchConditions.push({ 'accounting.isPaid': true });
    } else if (isPaid === 'false') {
      matchConditions.push({ 'accounting.isPaid': false });
    }

    if (user.role === 'specialAccess') {
      matchConditions.push({ type: 's1' });
    } else if (type) {
      matchConditions.push({ type });
    }

    if (itemId) {
      matchConditions.push({ 'items.itemRef': itemId });
    }

    if (startDate || endDate) {
      const dateFilter: any = {};
      if (startDate) {
        dateFilter.$gte = new Date(startDate);
      }
      if (endDate) {
        const nextDay = new Date(endDate);
        nextDay.setDate(nextDay.getDate() + 1);
        dateFilter.$lt = nextDay;
      }
      console.log(dateFilter);
      matchConditions.push({ createdAt: dateFilter });
    }

    if (matchConditions.length > 0) {
      pipeline.push({ $match: { $and: matchConditions } });
    }

    // Sort
    pipeline.push({ $sort: { createdAt: -1 } });

    // Pagination
    pipeline.push({ $skip: pageIndex * pageSize });
    pipeline.push({ $limit: pageSize });

    // Final project to clean up nested customer/vehicle if needed
    pipeline.push({
      $project: {
        number: 1,
        driverName: 1,
        generalNote: 1,
        customerNote: 1,
        type: 1,
        items: 1,
        accounting: 1,
        createdAt: 1,
        customer: {
          _id: 1,
          name: 1,
          phone: 1,
        },
        vehicle: {
          _id: 1,
          plate: 1,
        },
      },
    });

    const [invoices, totalCount] = await Promise.all([
      this.invoiceModel.aggregate(pipeline),
      this.invoiceModel.countDocuments(),

      // Note: not used by frontend so comment it for now:
      // this.invoiceModel.aggregate([
      //   { $match: filter },
      //   {
      //     $group: {
      //       _id: null,
      //       totalInvoiceAmount: { $sum: '$accounting.totalUsd' },
      //       totalAmountPaid: { $sum: '$accounting.paidAmountUsd' },
      //       totalOutstandingAmount: {
      //         $sum: {
      //           $subtract: [
      //             '$accounting.totalUsd',
      //             '$accounting.paidAmountUsd',
      //           ],
      //         },
      //       },
      //     },
      //   },
      // ]),
    ]);

    const totalPages = Math.ceil(totalCount / pageSize);

    // const totals = totalsResult[0] || {
    //   totalCost: 0,
    //   totalPrice: 0,
    //   totalProfitOrLoss: 0,
    // };

    return {
      invoices,
      // totals,
      pagination: {
        pageIndex,
        pageSize,
        totalCount,
        totalPages,
      },
    };
  }

  async getAll(dto: GetInvoicesDto, user: ReqUserData) {
    const { invoices, pagination } = await this.getInvoicesData(dto, user);

    // Flatten the invoices so each item becomes a separate object with its respective data
    const flattenedInvoices = invoices.reduce((acc: any, invoice) => {
      invoice.items.forEach((item) => {
        acc.push({
          ...invoice,
          item,
          items: undefined,
        });
      });
      return acc;
    }, []);

    return {
      invoices,
      flattenedInvoices,
      pagination,
    };
  }

  /**
   * Fetches the accounts receivable summary, including customer information and invoice amounts.
   *
   * @returns {Promise<{ rows: Array<{ customerName: string, invoiceAmount: number, amountPaid: number, outstandingAmount: number }>, totals: { totalInvoiceAmount: number, totalAmountPaid: number, totalOutstandingAmount: number } }>}
   * An object containing:
   * - `rows`: an array of objects representing each customer's invoice details.
   * - `totals`: an object containing the total invoice amount, total amount paid, and total outstanding amount for all customers.
   */
  async getAccountsRecievableSummary(dto: GetAccountsRecievableDto) {
    // TODO: add pagination on customers not on invoices.
    // -> I didn't know how to do it and chatGPT also
    const { startDate, endDate } = dto;

    const matchCondition: any = {};

    // Convert startDate and endDate to Date objects if they are strings
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    // If startDate is provided, add it to the match condition
    if (start) {
      start.setHours(0, 0, 0, 0); // Set start date to midnight
      matchCondition.createdAt = { $gte: start };
    }

    // If endDate is provided, add it to the match condition
    if (end) {
      end.setHours(23, 59, 59, 999); // Set end date to the last millisecond of the day
      matchCondition.createdAt = matchCondition.createdAt
        ? { ...matchCondition.createdAt, $lte: end }
        : { $lte: end };
    }

    const invoices = await this.invoiceModel.aggregate([
      {
        $match: matchCondition,
      },
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

    const isPaid = updatedDto.totalUsd <= updatedDto.paidAmountUsd;

    // Create new invoice
    const createdInvoice = await this.invoiceModel.create({
      customer: updatedDto.customerId,
      vehicle: updatedDto.vehicleId,
      number: invoiceNumber,
      paymentMethods: updatedDto.paymentMethods,
      type: dto.type,
      customerNote: updatedDto.customerNote,
      swaps: updatedDto.swaps,
      accounting: {
        isPaid,
        usdRate: accounting.usdRate,

        discount: updatedDto.discount,
        taxesUsd: updatedDto.taxesUsd,

        subTotalUsd: updatedDto.subTotalUsd,
        totalUsd: updatedDto.totalUsd,

        // in case the paid amount is larger than the total amount, do not add it to the paid amount
        paidAmountUsd: isPaid ? updatedDto.totalUsd : updatedDto.paidAmountUsd,
      },
      items: updatedDto.items,
    });

    await this.doInvoiceEffects(updatedDto);
    const createdInvoicePopulated = await this.invoiceModel
      .findById(createdInvoice._id)
      .populate('customer')
      .populate('vehicle');

    return createdInvoicePopulated;
  }

  async edit(invoiceId: string, dto: InvoiceDto) {
    await this.revertInvoiceEffects(invoiceId);

    // items existance validation
    const updatedDto = await this.validateItemsExistanceAndUpdateDto(dto);

    const isPaid = updatedDto.totalUsd <= updatedDto.paidAmountUsd;

    // Create new invoice
    await this.invoiceModel.findByIdAndUpdate(invoiceId, {
      customer: updatedDto.customerId,
      vehicle: updatedDto.vehicleId,
      type: dto.type,
      customerNote: updatedDto.customerNote,
      paymentMethods: updatedDto.paymentMethods,
      swaps: updatedDto.swaps,
      accounting: {
        isPaid,

        discount: updatedDto.discount,
        taxesUsd: updatedDto.taxesUsd,

        subTotalUsd: updatedDto.subTotalUsd,
        totalUsd: updatedDto.totalUsd,

        // in case the paid amount is larger than the total amount, do not add it to the paid amount
        paidAmountUsd: isPaid ? updatedDto.totalUsd : updatedDto.paidAmountUsd,
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
  async payCustomerInvoices(
    dto: PayCustomerInvoicesDto,
    doNotAddToCaisse?: boolean,
  ) {
    const { customerId, amount: customerPaidAmount, discount } = dto;

    // validate customer exists
    const customer = await this.customerService.getOneById(customerId);
    if (!customer) throw new BadRequestException('Customer not found');

    let remainingAmountThatCustomerPaidNow = customerPaidAmount;
    let remainingDiscountAmount = discount;

    const unpaidInvoices = await this.invoiceModel
      .find({
        customer: customerId,
        'accounting.isPaid': false,
      })
      .sort({ createdAt: 1 });

    for (const invoice of unpaidInvoices) {
      const invoiceRemaining =
        invoice.accounting.totalUsd - invoice.accounting.paidAmountUsd;

      let fieldsToUpdate = {
        'accounting.paidAmountUsd': invoice.accounting.paidAmountUsd,
        'accounting.isPaid': invoice.accounting.isPaid,
        'accounting.discount.type': 'fixed',
        'accounting.discount.amount': invoice.accounting.discount.amount || 0,
      };

      // if customer paid more than invoice remaining -> invoice is paid
      if (remainingAmountThatCustomerPaidNow >= invoiceRemaining) {
        fieldsToUpdate['accounting.paidAmountUsd'] += invoiceRemaining;
        fieldsToUpdate['accounting.isPaid'] = true;
        remainingAmountThatCustomerPaidNow -= invoiceRemaining;
      }
      // if customer paid less than invoice remaining -> invoice is not paid
      else {
        // if has discount merge it with the remaining amount paid
        if (
          remainingAmountThatCustomerPaidNow + remainingDiscountAmount >=
          invoiceRemaining
        ) {
          fieldsToUpdate['accounting.paidAmountUsd'] +=
            remainingAmountThatCustomerPaidNow;
          fieldsToUpdate['accounting.isPaid'] = true;

          const discountAmountDeducted =
            invoiceRemaining - remainingAmountThatCustomerPaidNow;
          fieldsToUpdate['accounting.discount.amount'] +=
            discountAmountDeducted;

          remainingAmountThatCustomerPaidNow = 0;
          remainingDiscountAmount -= discountAmountDeducted;
        } else {
          fieldsToUpdate['accounting.paidAmountUsd'] +=
            remainingAmountThatCustomerPaidNow;
          fieldsToUpdate['accounting.isPaid'] = false;
          remainingAmountThatCustomerPaidNow = 0;
        }
      }

      await this.invoiceModel.updateOne(
        { _id: invoice._id },
        { $set: fieldsToUpdate }, // set updated fields
      );

      if (remainingAmountThatCustomerPaidNow <= 0) break;
    }

    // effects of paying customer invoices
    if (customerPaidAmount > 0) {
      // Decrease customer loan
      const minLoan = Math.max(
        customer.loan - (customerPaidAmount + discount),
        0,
      );
      customer.loan = minLoan;
      await customer.save();

      // Update accounting
      await this.accountingService.incAccountingNumberFields({
        totalIncome: customerPaidAmount, // increase total income
        totalCustomersLoan: -(customerPaidAmount + discount), // decrease total customers loan
        caisse: doNotAddToCaisse ? 0 : customerPaidAmount, // increase caisse
      });

      // update daily report
      await this.reportService.syncDailyReport({
        date: new Date(),
        totalIncome: customerPaidAmount,
      });
    }
  }

  findOneByCustomer(customerId: string) {
    return this.invoiceModel.findOne({ customer: customerId });
  }

  private async doInvoiceEffects(updatedDto: InvoiceDtoWithItemsDetails) {
    // decrease item quantity
    const items = updatedDto.items.filter((item) => !!item.itemRef);
    for (const item of items) {
      await this.itemService.updateItemQuantity(item.itemRef, -item.quantity);
    }

    // save customer loan if did not pay all
    const remainingAmountToBePaid =
      updatedDto.totalUsd - updatedDto.paidAmountUsd;
    const extraAmountPaid = Math.abs(remainingAmountToBePaid);

    if (remainingAmountToBePaid > 0) {
      const customer = await this.customerService.getOneById(
        updatedDto.customerId,
      );
      if (!customer) throw new BadRequestException('Customer not found');

      customer.loan = customer.loan + remainingAmountToBePaid;
      await customer.save();

      // increase total customer loans
      await this.accountingService.incAccountingNumberFields({
        totalCustomersLoan: remainingAmountToBePaid,
      });
    }
    // if paid more, decrease customer loan if he has any + pay old customer invoices
    else if (extraAmountPaid > 0) {
      const customer = await this.customerService.getOneById(
        updatedDto.customerId,
      );
      if (!customer) throw new BadRequestException('Customer not found');

      if (customer.loan > 0) {
        const minLoan = Math.max(customer.loan - extraAmountPaid, 0);
        customer.loan = minLoan;
        await customer.save();

        // decrease total customer loans
        await this.accountingService.incAccountingNumberFields({
          totalCustomersLoan: -extraAmountPaid,
        });
      }

      // pay old customer invoices
      await this.payCustomerInvoices(
        {
          customerId: customer._id?.toString(),
          amount: extraAmountPaid,
          discount: 0,
        },
        true, // do not add to caisse since we are adding it before this step
      );
    }

    // calc total items cost amount
    const totalProductsCost = updatedDto.items
      .filter((item) => !!item.itemRef)
      .reduce((acc, item) => acc + item.quantity * item.cost, 0);

    // update accounting & cost of goods sold
    await this.accountingService.incAccountingNumberFields({
      totalIncome: updatedDto.paidAmountUsd,
      costOfGoodsSold: totalProductsCost,
      caisse: updatedDto.paidAmountUsd, // increase caisse
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

      const minLoan = Math.max(customer.loan - remainingAmount, 0);
      customer.loan = minLoan;
      await customer.save();

      // decrease total customer loans
      await this.accountingService.incAccountingNumberFields({
        totalCustomersLoan: -remainingAmount,
      });
    } else {
      // revert decreasing customer loan in case when paid he paid more than needed
      const extraAmountPaid = Math.abs(remainingAmount);

      const customer = await this.customerService.getOneById(
        invoice.customer?.toString(),
      );
      if (!customer) throw new BadRequestException('Customer not found');

      customer.loan += extraAmountPaid;
      await customer.save();

      // increase total customer loans
      await this.accountingService.incAccountingNumberFields({
        totalCustomersLoan: customer.loan,
      });
    }

    // calc total items cost amount
    const totalProductsCost = invoice.items
      .filter((item) => !!item.itemRef)
      .reduce((acc, item) => acc + item.quantity * item.cost, 0);

    // decrease accounting total income + cost of goods sold
    await this.accountingService.incAccountingNumberFields({
      totalIncome: -invoice.accounting.paidAmountUsd,
      costOfGoodsSold: -totalProductsCost,
      caisse: -invoice.accounting.paidAmountUsd, // decrease caisse
    });

    // update daily report
    await this.reportService.syncDailyReport({
      date: invoice.createdAt,
      totalIncome: -invoice.accounting.paidAmountUsd,
    });
  }

  private async validateItemsExistanceAndUpdateDto(
    dto: InvoiceDto,
  ): Promise<InvoiceDtoWithItemsDetails> {
    // Separate items and services from the provided DTO
    const itemsOnly = dto.items.filter((item) => !!item.itemRef);
    const itemRefs = itemsOnly.map((item) => item.itemRef);
    const servicesOnly = dto.items.filter((item) => !!item.serviceRef);
    const serviceRefs = servicesOnly.map((item) => item.serviceRef);

    let dbItems: IItem[] = [];
    let dbServices: IService[] = [];

    // Process items if there are any
    let itemsWithDetails: InvoiceItemWithDetails[] = [];
    if (itemRefs.length > 0) {
      // get products from db
      dbItems = await this.itemService.getManyByIds(itemRefs);

      // make sure all items are valid
      if (dbItems.length !== itemRefs.length)
        throw new BadRequestException('Some items are not valid');

      // override the dto items array to add product fields for later reference
      itemsWithDetails = itemsOnly.map((itemInDto) => {
        const itemDB = dbItems.find((product) => {
          return product._id.toString() === itemInDto.itemRef;
        });
        if (!itemDB) throw new BadRequestException('Item not found');

        return {
          ...itemInDto,
          name: itemDB.name,
          cost: itemDB.cost,
        };
      });
    }

    let servicesWithDetails: any[] = [];
    // Process services if there are any
    if (serviceRefs.length > 0) {
      // get services from db
      dbServices = await this.servicesService.getManyByIds(serviceRefs);

      // make sure all services are valid
      if (dbServices.length !== serviceRefs.length)
        throw new BadRequestException('Some services are not valid');

      // override the dto items array to add service fields for later reference
      servicesWithDetails = servicesOnly.map((serviceInDto) => {
        const serviceDB = dbServices.find(
          (service) => service._id.toString() === serviceInDto.serviceRef,
        );
        if (!serviceDB) throw new BadRequestException('Service not found');

        return {
          ...serviceInDto,
          name: serviceDB.name,
        };
      });
    }

    return { ...dto, items: [...itemsWithDetails, ...servicesWithDetails] };
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

    // Get the last two digits of the current year (e.g. 2022 -> 22)
    const lastTwoDigitsOfYear = currentYear.toString().slice(-2);

    return type === 's2'
      ? `s2-${lastTwoDigitsOfYear}${paddedSeq}`
      : `${lastTwoDigitsOfYear}${paddedSeq}`;
  }
}
