import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IPurchase, Purchase } from './purchase.schema';
import { Model } from 'mongoose';
import { AddPurchaseDto } from './dto/add-purchase.dto';
import { ISupplier, Supplier } from '../supplier/supplier.schema';
import { IItem, Item } from '../item/item.schema';

@Injectable()
export class PurchaseService {
  constructor(
    @InjectModel(Purchase.name)
    private purchaseModel: Model<IPurchase>,
    @InjectModel(Item.name)
    private itemModel: Model<IItem>,
    @InjectModel(Supplier.name)
    private supplierModel: Model<ISupplier>,
  ) {}

  async create(dto: AddPurchaseDto) {
    // get products from db and save the name with each one
    const products = await this.itemModel
      .find({ _id: dto.items.map((item) => item.item) })
      .lean();

    if (products.length !== dto.items.length)
      throw new BadRequestException('Some items are not valid');

    // override the dto items array to add the product name field
    dto.items = products.map((product) => ({
      ...dto.items.find((item) => item.item === product._id?.toString())!,
      name: product.name,
    }));

    // save the purchase
    await this.purchaseModel.create({
      supplier: dto.supplierId,
      invoiceNumber: dto.invoiceNumber,
      invoiceDate: dto.invoiceDate,
      customerConsultant: dto.customerConsultant,
      phoneNumber: dto.phoneNumber,
      vatPercent: dto.vatPercent,
      vatLBP: dto.vatLBP,
      totalAmount: dto.totalAmount,
      items: dto.items,
    });

    // update product quantity + price
    for (const item of dto.items) {
      const product = await this.itemModel.findById(item.item);
      if (!product) throw new BadRequestException('Product not found');

      product.quantity += item.quantity;

      // calc new cost
      const totalQuantityBought = product.quantity + item.quantityFree;
      product.cost = item.totalPrice / totalQuantityBought;
      await product.save();
    }

    // add loan to supplier of not fully paid
    const remainingAmount = dto.totalAmount - dto.amountPaid;
    if (remainingAmount > 0) {
      const supplier = await this.supplierModel.findById(dto.supplierId);
      if (!supplier) throw new BadRequestException('Supplier not found');

      supplier.loan = supplier.loan + remainingAmount;
      await supplier.save();
    }
  }
}
