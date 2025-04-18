import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  IInvoice,
  IInvoiceCounter,
  Invoice,
  InvoiceCounter,
  InvoiceType,
} from './invoice.schema';
import { InvoiceDto } from './dto/invoice.dto';
import dayjs from 'dayjs';
import { IService, Service } from '../service/service.schema';
import { IItem, Item } from '../item/item.schema';

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
  ) {}

  async create(dto: InvoiceDto) {
    const updatedDto = await this.validateItemsAndUpdateDto(dto);

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

    // TODO:
    // save product cost as expenses
    // update accounting
  }

  private async validateItemsAndUpdateDto(dto: InvoiceDto) {
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
    const currentYear = dayjs().format('YYYY');

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
