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
import { ExpenseService } from '../expense/expense.service';

@Injectable()
export class PurchaseService {
  constructor(
    @InjectModel(Purchase.name)
    private purchaseModel: Model<IPurchase>,
    private readonly itemService: ItemService,
    private readonly supplierService: SupplierService,
    private readonly accountingService: AccountingService,
    private readonly expenseService: ExpenseService,
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
      });
      // @ts-ignore
      filter.$and[0].$or.push({
        customerConsultant: { $regex: search, $options: 'i' },
      });
      // @ts-ignore
      filter.$and[0].$or.push({
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

    const isPaid = dto.totalAmount <= dto.amountPaid;

    // save the purchase
    const newPurchase = await this.purchaseModel.create({
      supplier: dto.supplierId,
      invoiceNumber: dto.invoiceNumber,
      invoiceDate: dto.invoiceDate,
      customerConsultant: dto.customerConsultant,
      phoneNumber: dto.phoneNumber,
      vatPercent: dto.vatPercent,
      vatLBP: dto.vatLBP,
      subTotal: dto.subTotal,
      totalAmount: dto.totalAmount,
      amountPaid: dto.amountPaid,
      usdRate: accounting.usdRate,
      items: dto.items,
      isPaid,
    });

    await this.doPurchaseEffects(dto, newPurchase._id?.toString());
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

    const isPaid = dto.totalAmount <= dto.amountPaid;

    // update the purchase
    await this.purchaseModel.findByIdAndUpdate(purchaseId, {
      supplier: dto.supplierId,
      invoiceNumber: dto.invoiceNumber,
      invoiceDate: dto.invoiceDate,
      customerConsultant: dto.customerConsultant,
      phoneNumber: dto.phoneNumber,
      vatPercent: dto.vatPercent,
      vatLBP: dto.vatLBP,
      subTotal: dto.subTotal,
      totalAmount: dto.totalAmount,
      amountPaid: dto.amountPaid,
      items: dto.items,
      isPaid,
    });

    await this.doPurchaseEffects(dto, purchaseId);
  }

  async delete(purchaseId: string) {
    await this.revertPurchaseEffects(purchaseId);

    await this.purchaseModel.findByIdAndDelete(purchaseId);
  }

  private async doPurchaseEffects(dto: PurchaseDto, purchaseId: string) {
    // update product quantity + new product cost
    for (const item of dto.items) {
      const product = await this.itemService.getOneById(item.itemId);
      if (!product) throw new BadRequestException('Product not found');

      const totalQuantityBought = item.quantity + item.quantityFree;
      product.quantity += totalQuantityBought;

      // calc new cost
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
      this.accountingService.incAccountingNumberFields({
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
        this.accountingService.incAccountingNumberFields({
          totalSuppliersLoan: -extraAmountPaid,
        });
      }
    }

    // save the amount paid as expense
    if (dto.amountPaid > 0) {
      const newExpense = await this.expenseService.createWithoutEffects({
        supplierId: dto.supplierId,
        amount: dto.amountPaid,
        date: getFormattedDate(new Date()),
        purchasesIds: [purchaseId],

        expenseTypeId: null,
        note: null,
      });

      // link the expense to the purchase
      await this.purchaseModel.updateOne(
        { _id: purchaseId },
        {
          $set: {
            expense: newExpense._id,
          },
        },
      );
    }

    await this.accountingService.incAccountingNumberFields({
      // decrease caisse
      caisse: -dto.amountPaid,
      // increase total expense
      totalExpenses: dto.amountPaid,
    });
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
        continue; //-> ignore deleted products
      }

      // Revert quantity
      const totalQuantityBought = item.quantity + item.quantityFree;
      product.quantity -= totalQuantityBought;

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

      if (supplier) {
        const minLoan = Math.max(supplier.loan - remainingAmount, 0);

        supplier.loan = minLoan;
        await supplier.save();

        // decrease total supplier loans
        this.accountingService.incAccountingNumberFields({
          totalSuppliersLoan: -supplier.loan,
        });
      }

      //-> ignore deleted suppliers
    } else {
      // revert decreasing supplier loan in case when paid he paid more than needed
      const extraAmountPaid = Math.abs(remainingAmount);

      const supplier = await this.supplierService.getOneById(
        purchase.supplier?.toString(),
      );

      if (supplier) {
        supplier.loan += extraAmountPaid;
        await supplier.save();

        // increase total supplier loans
        this.accountingService.incAccountingNumberFields({
          totalSuppliersLoan: supplier.loan,
        });
      }
      //-> ignore deleted suppliers
    }

    // delete expense
    await this.expenseService.deleteWithoutEffects(
      purchase.expense?.toString(),
    );

    await this.accountingService.incAccountingNumberFields({
      // increase caisse
      caisse: purchase.amountPaid,
      // decrease total expense
      totalExpenses: -purchase.amountPaid,
    });
  }
}
