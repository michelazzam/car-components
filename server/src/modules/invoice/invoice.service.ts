import { BadRequestException, Injectable } from '@nestjs/common';
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
import { IService, Service } from '../service/service.schema';
import { IItem, Item } from '../item/item.schema';
import { GetInvoicesDto } from './dto/get-invoices.dto';
import { formatISODate } from 'src/utils/formatIsoDate';
import { Customer, ICustomer } from '../customer/customer.schema';
import { ReqUserData } from '../user/interfaces/req-user-data.interface';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectModel(Invoice.name)
    private invoiceModel: Model<IInvoice>,
    @InjectModel(InvoiceCounter.name)
    private invoiceCounterModel: Model<IInvoiceCounter>,
    @InjectModel(Item.name)
    private itemModel: Model<IItem>,
    @InjectModel(Service.name)
    private serviceModel: Model<IService>,
    @InjectModel(Customer.name)
    private customerModel: Model<ICustomer>,
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
        dateFilter.$lt = formatISODate(nextDay);
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

    const [invoices, totalCount] = await Promise.all([
      this.invoiceModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(pageIndex * pageSize)
        .limit(pageSize)
        .populate('customer')
        .populate('vehicle'),
      this.invoiceModel.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalCount / pageSize);

    return {
      invoices,
      pagination: {
        pageIndex,
        pageSize,
        totalCount,
        totalPages,
      },
    };
  }

  async create(dto: InvoiceDto) {
    const updatedDto = await this.validateItemsExistanceAndUpdateDto(dto);

    // Generate invoice number
    const invoiceNumber = await this.generateInvoiceNumber(dto.type);

    // Create new invoice
    await this.invoiceModel.create({
      customer: updatedDto.customerId,
      vehicle: updatedDto.vehicleId,
      number: invoiceNumber,
      type: dto.type,
      discount: updatedDto.discount,
      driverName: updatedDto.driverName,
      generalNote: updatedDto.generalNote,
      customerNote: updatedDto.customerNote,
      accounting: {
        isPaid: updatedDto.isPaid,
        usdRate: 90000, //TODO: get from accounting
        amountPaidLbp: updatedDto.amountPaidLbp,
        amountPaidUsd: updatedDto.amountPaidUsd,
      },
      items: updatedDto.items,
    });

    // decrease item quantity
    const items = updatedDto.items.filter((item) => !!item.itemRef);
    for (const item of items) {
      await this.itemModel.findByIdAndUpdate(item.itemRef, {
        $inc: { quantity: -item.quantity },
      });
    }

    // save customer loan if did not pay all
    const remainingAmount =
      updatedDto.totalAmount -
      (updatedDto.amountPaidUsd + updatedDto.amountPaidLbp / 90000);

    if (!updatedDto.isPaid && remainingAmount > 0) {
      const customer = await this.customerModel.findById(dto.customerId);
      if (!customer) throw new BadRequestException('Customer not found');

      customer.loan = customer.loan + remainingAmount;
      await customer.save();
    }

    // TODO:
    // save product cost as expenses
    // update accounting
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
      dbItems = await this.itemModel.find({ _id: { $in: itemRefs } }).lean();

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
      dbServices = await this.serviceModel
        .find({ _id: { $in: serviceRefs } })
        .lean();

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
