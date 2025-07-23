import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';
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
import { Expense, IExpense } from '../expense/expense.schema';
import { LoansTransactionsService } from '../loans-transactions/loans-transactions.service';
import { TransactionsService } from '../transactions/transactions.service';
import { IItem } from '../item/item.schema';

@Injectable()
export class PurchaseService implements OnModuleInit {
  constructor(
    @InjectModel(Purchase.name)
    private purchaseModel: Model<IPurchase>,
    @InjectModel(Expense.name)
    private expenseModel: Model<IExpense>,
    private readonly itemService: ItemService,
    private readonly supplierService: SupplierService,
    private readonly accountingService: AccountingService,
    private readonly loansTransactionsService: LoansTransactionsService,
    private readonly transactionsService: TransactionsService,
  ) {}

  onModuleInit() {
    this.migrateQuantityReturned();
  }

  private async migrateQuantityReturned() {
    const purchasesWithoutReturns = await this.purchaseModel
      .find({
        items: {
          $elemMatch: {
            $or: [{ returns: { $exists: false } }],
          },
        },
      })
      .lean();

    // add empty 'returns' array to all items without returns []
    for (const purchase of purchasesWithoutReturns) {
      const updatedItems = purchase.items.map((item) => {
        return {
          ...item,
          returns: [],
        };
      });

      await this.purchaseModel.updateOne(
        { _id: purchase._id },
        { $set: { items: updatedItems } },
      );
    }

    if (purchasesWithoutReturns.length > 0)
      console.log(
        `Added empty returns array for ${purchasesWithoutReturns.length} purchases`,
      );

    // get all purchases with quantityReturned>0
    // for each item, create a new returns array with object { quantityReturned, returnedAt }
    // returnedAt is the purchase date
    const purchases = await this.purchaseModel
      .find({
        'items.quantityReturned': { $gt: 0 },
      })
      .lean();

    for (const purchase of purchases) {
      const updatedItems = purchase.items.map((item) => {
        if (item.quantityReturned > 0) {
          const returns = [
            {
              quantityReturned: item.quantityReturned,
              returnedAt: purchase.invoiceDate,
            },
          ];
          const { quantityReturned, ...rest } = item;
          return {
            ...rest,
            returns,
          };
        }
        return item;
      });

      await this.purchaseModel.updateOne(
        { _id: purchase._id },
        { $set: { items: updatedItems } },
      );
    }

    if (purchases.length > 0)
      console.log(`Migration done for ${purchases.length} purchases`);
  }

  async getAll(dto: GetPurchaseDto) {
    const {
      pageIndex,
      search,
      pageSize,
      supplierId,
      startDate,
      endDate,
      itemId,
      onlyReturned,
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

    if (onlyReturned) {
      // @ts-ignore
      filter.$and[0].$or.push({
        items: {
          $elemMatch: {
            'returns.quantityReturned': { $gt: 0 },
          },
        },
      });
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
        .populate('supplier')
        .populate('expenses'),
      this.purchaseModel.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalCount / pageSize);

    let itemsReturned = [];
    if (onlyReturned) {
      // split the purchases into array of items (+the purchase id and invoiceNumber field)
      itemsReturned = purchases.reduce((acc: any, purchase) => {
        purchase.items.forEach((item) => {
          acc.push({
            purchaseId: purchase._id,
            purchaseInvoiceNumber: purchase.invoiceNumber,
            item,
            items: undefined,
          });
        });
        return acc;
      }, []);
    }

    return {
      purchases,
      itemsReturned,
      pagination: {
        pageIndex,
        pageSize,
        totalCount,
        totalPages,
      },
    };
  }

  async getManyByIds(ids: string[]) {
    return this.purchaseModel.find({ _id: { $in: ids } });
  }

  async getUnpaidPurchases({ supplierId }: { supplierId: string }) {
    return this.purchaseModel
      .find({
        supplier: supplierId,
        isPaid: false,
      })
      .sort({ createdAt: 1 });
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
      subTotal: formatMoneyField(dto.subTotal),
      totalAmount: formatMoneyField(dto.totalAmount),
      amountPaid: formatMoneyField(dto.amountPaid),
      usdRate: accounting.usdRate,
      items: dto.items,
      isPaid,
    });

    await this.doPurchaseEffects(dto, newPurchase._id?.toString(), {
      isEditMode: false,
    });
  }

  async edit(purchaseId: string, dto: PurchaseDto) {
    // 1. Revert effects so we get the original items back
    const currentPurchase = await this.revertPurchaseEffects(purchaseId);

    // 2. Identify which incoming items are truly new
    const newItemsDto = dto.items.filter(
      (item) =>
        !currentPurchase.items.some(
          (prod) => prod.item?.toString() === item.itemId,
        ),
    );

    // 3. Fetch the corresponding products
    const productsDB = await this.itemService.getManyByIds(
      newItemsDto.map((item) => item.itemId),
    );
    if (productsDB.length !== newItemsDto.length) {
      throw new BadRequestException('Some items are not valid');
    }

    // 4. Build a lookup map for fast patching
    const productsMap = new Map<string, IItem>(
      productsDB.map((product) => [product._id.toString(), product]),
    );

    // 5. Walk over every dto.item, patch in the extra fields for new ones, keep old ones untouched
    dto.items = dto.items.map((item) => {
      const product = productsMap.get(item.itemId);
      if (product) {
        // this was a new item—inject the DB fields
        return {
          ...item,
          item: product._id,
          name: product.name,
          currentItemCost: product.cost,
        };
      } else {
        // an old item—find its record in the reverted purchase and keep its original data
        const existing = currentPurchase.items.find(
          (prod) => prod.item?.toString() === item.itemId,
        )!;
        return {
          ...item,
          item: existing.item,
          name: existing.name!,
          currentItemCost: existing.currentItemCost!,
        };
      }
    });

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
      subTotal: formatMoneyField(dto.subTotal),
      totalAmount: formatMoneyField(dto.totalAmount),
      amountPaid: formatMoneyField(dto.amountPaid),
      items: dto.items,
      isPaid,
    });

    await this.doPurchaseEffects(dto, purchaseId, { isEditMode: true });
  }

  async delete(purchaseId: string) {
    await this.revertPurchaseEffects(purchaseId);

    // remove purchase link from expenses
    await this.expenseModel.updateMany(
      { purchases: purchaseId },
      {
        $pull: { purchases: purchaseId },
      },
    );

    await this.purchaseModel.findByIdAndDelete(purchaseId);
  }

  async updatePurchasePayments({
    purchaseId,
    amountPaid,
    isPaid,
    expenseLinking,
  }: {
    purchaseId: string;
    amountPaid: number;
    isPaid: boolean;
    expenseLinking: {
      expenseId: string;
      action: 'add' | 'remove';
    };
  }) {
    const updatePayload: any = {
      $set: {
        isPaid,
      },
      $inc: {
        amountPaid: amountPaid,
      },
    };

    if (expenseLinking.action === 'add') {
      updatePayload.$addToSet = { expenses: expenseLinking.expenseId };
    } else if (expenseLinking.action === 'remove') {
      updatePayload.$pull = { expenses: expenseLinking.expenseId };
    }

    await this.purchaseModel.updateOne({ _id: purchaseId }, updatePayload);
  }

  private async doPurchaseEffects(
    dto: PurchaseDto,
    purchaseId: string,
    { isEditMode }: { isEditMode: boolean },
  ) {
    const actions: string[] = [];

    // update product quantity + new product cost
    for (const item of dto.items) {
      const product = await this.itemService.getOneById(item.itemId);
      if (!product) {
        // in edit mode some products might not exist, they might have deleted them
        if (isEditMode) {
          continue;
        } else {
          throw new BadRequestException('Product not found');
        }
      }

      const totalReturns = item.returns.reduce(
        (acc, ret) => acc + ret.quantityReturned,
        0,
      );

      const totalQuantityBought =
        item.quantity + item.quantityFree - totalReturns;
      product.quantity += totalQuantityBought;

      const hasReturnedAllItems =
        totalReturns === item.quantity + item.quantityFree;

      // calc new cost only if he hasn't returned all items, otherwise it will divide by 0
      if (!hasReturnedAllItems) {
        // calc new cost
        product.cost = formatMoneyField(item.totalPrice / totalQuantityBought)!;
        await product.save();
      }

      actions.push(
        `Purchased ${item.quantity} x ${product.name} for ${formatMoneyField(
          item.totalPrice,
        )}$`,
      );
    }

    // add loan to supplier of not fully paid
    const remainingAmount = dto.totalAmount - dto.amountPaid;
    let remainingSupplierLoan = 0;
    if (remainingAmount > 0) {
      const supplier = await this.supplierService.getOneById(dto.supplierId);
      if (!supplier) throw new BadRequestException('Supplier not found');

      supplier.loan = supplier.loan + remainingAmount;
      remainingSupplierLoan = supplier.loan + remainingAmount;
      await supplier.save();

      // increase total supplier loans
      this.accountingService.incAccountingNumberFields({
        totalSuppliersLoan: remainingAmount, // here we should add the remaining amount
      });

      actions.push(
        `Added loan to supplier ${supplier.name} of amount: ${formatMoneyField(
          remainingAmount,
        )}$`,
      );
    }
    // if paid more, decrease supplier loan if he has any
    else if (remainingAmount < 0) {
      const extraAmountPaid = Math.abs(remainingAmount);

      const supplier = await this.supplierService.getOneById(dto.supplierId);
      if (!supplier) throw new BadRequestException('Supplier not found');

      if (supplier.loan > 0) {
        const minLoan = supplier.loan - extraAmountPaid;
        supplier.loan = minLoan;
        remainingSupplierLoan = minLoan;
        await supplier.save();

        // decrease total supplier loans
        this.accountingService.incAccountingNumberFields({
          totalSuppliersLoan: -extraAmountPaid,
        });
      }

      actions.push(
        `Removed loan from supplier ${supplier.name} of amount: ${formatMoneyField(
          extraAmountPaid,
        )}$`,
      );
    }

    // save the amount paid as expense
    if (dto.amountPaid > 0) {
      const newExpense = await this.expenseModel.create({
        supplier: dto.supplierId,
        amount: dto.amountPaid,
        date: getFormattedDate(new Date()),
        purchases: [purchaseId],
      });

      // link the expense to the purchase
      await this.purchaseModel.updateOne(
        { _id: purchaseId },
        {
          $push: {
            expenses: newExpense._id,
          },
        },
      );

      // save loan transaction
      await this.loansTransactionsService.saveLoanTransaction({
        type: 'new-purchase',
        amount: dto.amountPaid,
        loanRemaining: remainingSupplierLoan,
        supplierId: dto.supplierId,
        customerId: null,
        expenseId: newExpense._id?.toString(),
        invoiceId: null,
      });
    }

    await this.accountingService.incAccountingNumberFields({
      // decrease caisse
      caisse: -dto.amountPaid,
      // increase total expense
      totalExpenses: dto.amountPaid,
    });

    actions.push(
      'Decreased caisse and increased total expense. Amount: $' +
        dto.amountPaid,
    );
    await this.transactionsService.saveTransaction({
      whatHappened: actions.join('.\n\n '),
      totalAmount: dto.amountPaid,
      discountAmount: 0,
      finalAmount: dto.amountPaid,
      type: 'outcome',
    });
  }

  private async revertPurchaseEffects(purchaseId: string) {
    const actions: string[] = [];

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

      const totalReturns = (item.returns || []).reduce(
        (acc, ret) => acc + ret.quantityReturned,
        0,
      );

      // Revert quantity
      const totalQuantityBought =
        item.quantity + item.quantityFree - totalReturns;
      product.quantity -= totalQuantityBought;

      // Revert cost to what it was during purchase
      product.cost = item.currentItemCost;

      await product.save();

      actions.push(`Reverted purchase of ${item.quantity} x ${product.name}`);
    }

    // Revert supplier loan in case didn't pay all
    const remainingAmount = purchase.totalAmount - purchase.amountPaid;
    if (remainingAmount > 0) {
      const supplier = await this.supplierService.getOneById(
        purchase.supplier?.toString(),
      );

      if (supplier) {
        const minLoan = supplier.loan - remainingAmount;

        supplier.loan = minLoan;
        await supplier.save();

        // decrease total supplier loans
        this.accountingService.incAccountingNumberFields({
          totalSuppliersLoan: -supplier.loan,
        });

        actions.push(
          `Removed loan from supplier ${supplier.name} of amount: ${formatMoneyField(
            -supplier.loan,
          )}$`,
        );
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

        actions.push(
          `Re-added loan to supplier ${supplier.name} of amount: ${formatMoneyField(
            extraAmountPaid,
          )}$`,
        );
      }

      //-> ignore deleted suppliers
    }

    const expenseId = purchase.expenses?.[0]?.toString();
    if (expenseId) {
      // delete expense
      await this.expenseModel.deleteOne({
        _id: expenseId,
      });

      // remove expense from purchase
      await this.purchaseModel.updateOne(
        { _id: purchaseId },
        {
          $pull: { expenses: expenseId },
        },
      );

      // delete loan transaction
      await this.loansTransactionsService.deleteByExpenseId(expenseId);
    }

    await this.accountingService.incAccountingNumberFields({
      // increase caisse
      caisse: purchase.amountPaid,
      // decrease total expense
      totalExpenses: -purchase.amountPaid,
    });

    actions.push(
      'Increased caisse and decreased total expense. Amount: $' +
        purchase.amountPaid,
    );
    await this.transactionsService.saveTransaction({
      whatHappened: actions.join('.\n\n '),
      totalAmount: purchase.amountPaid,
      discountAmount: 0,
      finalAmount: purchase.amountPaid,
      type: 'income',
    });

    return purchase;
  }
}
