import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IPurchase, Purchase } from './purchase.schema';
import mongoose, { FilterQuery, Model } from 'mongoose';
import { PurchaseDto } from './dto/purchase.dto';
import { GetPurchaseDto } from './dto/get-purchase.dto';
import { getFormattedDate } from 'src/utils/getFormattedDate';
import { AccountingService } from '../accounting/accounting.service';
import { SupplierService } from '../supplier/supplier.service';
import { ItemService } from '../item/item.service';
import { formatMoneyField } from 'src/utils/formatMoneyField';

@Injectable()
export class PurchaseService {
  constructor(
    @InjectModel(Purchase.name)
    private purchaseModel: Model<IPurchase>,
    private readonly itemService: ItemService,
    private readonly supplierService: SupplierService,
    private readonly accountingService: AccountingService,
  ) {}

  async getAll(dto: GetPurchaseDto) {
    const {
      pageIndex,
      search,
      pageSize,
      supplierId,
      startDate,
      endDate,
      itemId,
    } = dto;

    const filter: FilterQuery<IPurchase> = { $and: [{ $or: [] }] };

    if (search) {
      // @ts-ignore
      filter.$and[0].$or.push({
        invoiceNumber: { $regex: search, $options: 'i' },
        customerConsultant: { $regex: search, $options: 'i' },
        phoneNumber: { $regex: search, $options: 'i' },
      });
    }

    if (supplierId) {
      // @ts-ignore
      filter.$and[0].$or.push({ supplier: supplierId });
    }

    if (itemId) {
      // @ts-ignore
      filter.$and.push({
        'items.item': new mongoose.Types.ObjectId(itemId),
      });
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
      filter.$and.push({ invoiceDate: dateFilter });
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

    const [purchases, totalCount] = await Promise.all([
      this.purchaseModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(pageIndex * pageSize)
        .limit(pageSize)
        .populate('supplier'),
      this.purchaseModel.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalCount / pageSize);

    return {
      purchases,
      pagination: {
        pageIndex,
        pageSize,
        totalCount,
        totalPages,
      },
    };
  }

  async create(dto: PurchaseDto) {
    // get products from db and save the name with each one
    const products = await this.itemService.getManyByIds(
      dto.items.map((item) => item.itemId),
    );

    if (products.length !== dto.items.length)
      throw new BadRequestException('Some items are not valid');

    // override the dto items array to add the product name field
    dto.items = products.map((product) => ({
      ...dto.items.find((item) => item.itemId === product._id?.toString())!,
      item: product._id,
      name: product.name,
      currentItemCost: product.cost,
    }));

    const accounting = await this.accountingService.getAccounting();

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
      amountPaid: dto.amountPaid,
      usdRate: accounting.usdRate,
      items: dto.items,
    });

    await this.doPurchaseEffects(dto);
  }

  async edit(purchaseId: string, dto: PurchaseDto) {
    await this.revertPurchaseEffects(purchaseId);

    // get products from db and save the name with each one
    const products = await this.itemService.getManyByIds(
      dto.items.map((item) => item.itemId),
    );

    if (products.length !== dto.items.length)
      throw new BadRequestException('Some items are not valid');

    // override the dto items array to add the product name field
    dto.items = products.map((product) => ({
      ...dto.items.find((item) => item.itemId === product._id?.toString())!,
      item: product._id,
      name: product.name,
      currentItemCost: product.cost,
    }));

    // update the purchase
    await this.purchaseModel.findByIdAndUpdate(purchaseId, {
      supplier: dto.supplierId,
      invoiceNumber: dto.invoiceNumber,
      invoiceDate: dto.invoiceDate,
      customerConsultant: dto.customerConsultant,
      phoneNumber: dto.phoneNumber,
      vatPercent: dto.vatPercent,
      vatLBP: dto.vatLBP,
      totalAmount: dto.totalAmount,
      amountPaid: dto.amountPaid,
      items: dto.items,
    });

    await this.doPurchaseEffects(dto);
  }

  async delete(purchaseId: string) {
    await this.revertPurchaseEffects(purchaseId);

    await this.purchaseModel.findByIdAndDelete(purchaseId);
  }

  private async doPurchaseEffects(dto: PurchaseDto) {
    // update product quantity + new product cost
    for (const item of dto.items) {
      const product = await this.itemService.getOneById(item.itemId);
      if (!product) throw new BadRequestException('Product not found');

      product.quantity += item.quantity;

      // calc new cost
      const totalQuantityBought = product.quantity + item.quantityFree;
      product.cost = formatMoneyField(item.totalPrice / totalQuantityBought)!;
      await product.save();
    }

    // add loan to supplier of not fully paid
    const remainingAmount = dto.totalAmount - dto.amountPaid;
    if (remainingAmount > 0) {
      const supplier = await this.supplierService.getOneById(dto.supplierId);
      if (!supplier) throw new BadRequestException('Supplier not found');

      supplier.loan = supplier.loan + remainingAmount;
      await supplier.save();

      // increase total supplier loans
      this.accountingService.updateAccounting({
        totalSuppliersLoan: supplier.loan,
      });
    }

    // if paid more, decrease supplier loan if he has any
    else if (remainingAmount < 0) {
      const extraAmountPaid = Math.abs(remainingAmount);

      const supplier = await this.supplierService.getOneById(dto.supplierId);
      if (!supplier) throw new BadRequestException('Supplier not found');

      if (supplier.loan > 0) {
        const minLoan = Math.max(supplier.loan - extraAmountPaid, 0);
        supplier.loan = minLoan;
        await supplier.save();

        // decrease total supplier loans
        this.accountingService.updateAccounting({
          totalSuppliersLoan: -extraAmountPaid,
        });
      }
    }
  }

  private async revertPurchaseEffects(purchaseId: string) {
    const purchase = await this.purchaseModel.findById(purchaseId).lean();
    if (!purchase) {
      throw new BadRequestException('Purchase not found');
    }

    // Revert product quantities and cost
    for (const item of purchase.items) {
      const product = await this.itemService.getOneById(item.item?.toString());
      if (!product) {
        continue; //ignore deleted products
      }

      // Revert quantity
      product.quantity -= item.quantity;

      // Revert cost to what it was during purchase
      product.cost = item.currentItemCost;

      await product.save();
    }

    // Revert supplier loan in case didn't pay all
    const remainingAmount = purchase.totalAmount - purchase.amountPaid;
    if (remainingAmount > 0) {
      const supplier = await this.supplierService.getOneById(
        purchase.supplier?.toString(),
      );
      if (!supplier) {
        return; //ignore deleted suppliers
      }

      const minLoan = Math.max(supplier.loan - purchase.amountPaid, 0);
      supplier.loan = minLoan;
      await supplier.save();

      // decrease total supplier loans
      this.accountingService.updateAccounting({
        totalSuppliersLoan: -supplier.loan,
      });
    } else {
      // revert decreasing supplier loan in case when paid he paid more than needed
      const extraAmountPaid = Math.abs(remainingAmount);

      const supplier = await this.supplierService.getOneById(
        purchase.supplier?.toString(),
      );
      if (!supplier) {
        return; //ignore deleted suppliers
      }

      supplier.loan += extraAmountPaid;
      await supplier.save();

      // increase total supplier loans
      this.accountingService.updateAccounting({
        totalSuppliersLoan: supplier.loan,
      });
    }
  }
}
