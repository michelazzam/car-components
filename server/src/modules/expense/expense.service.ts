import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Expense, IExpense } from './expense.schema';
import { FilterQuery, Model } from 'mongoose';
import { ExpenseDto } from './dto/expense.dto';
import { GetExpensesDto } from './dto/get-expenses.dto';
import { getFormattedDate } from 'src/utils/getFormattedDate';
import { AccountingService } from '../accounting/accounting.service';
import { ReportService } from '../report/report.service';
import { SupplierService } from '../supplier/supplier.service';
import { PurchaseService } from '../purchase/purchase.service';
import { TransactionsService } from '../transactions/transactions.service';
import { LoansTransactionsService } from '../loans-transactions/loans-transactions.service';

@Injectable()
export class ExpenseService {
  constructor(
    @InjectModel(Expense.name)
    private expenseModel: Model<IExpense>,
    private readonly supplierervice: SupplierService,
    private readonly accountingService: AccountingService,
    private readonly reportService: ReportService,
    private readonly purchaseService: PurchaseService,
    private readonly transactionsService: TransactionsService,
    private readonly loansTransactionsService: LoansTransactionsService,
  ) {}

  async getAll(dto: GetExpensesDto) {
    const {
      pageIndex,
      search,
      pageSize,
      expenseTypeId,
      startDate,
      endDate,
      supplierId,
    } = dto;

    const filter: FilterQuery<IExpense> = { $and: [{ $or: [] }] };

    if (search) {
      // @ts-ignore
      filter.$and[0].$or.push({
        note: { $regex: search, $options: 'i' },
      });
    }

    if (expenseTypeId) {
      // @ts-ignore
      filter.$and[0].$or.push({ expenseType: expenseTypeId });
    }

    if (supplierId) {
      // @ts-ignore
      filter.$and[0].$or.push({ supplier: supplierId });
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
      filter.$and.push({ date: dateFilter });
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

    const [expenses, totalCount] = await Promise.all([
      this.expenseModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(pageIndex * pageSize)
        .limit(pageSize)
        .populate('supplier')
        .populate('expenseType')
        .populate('purchases', { _id: 1, invoiceNumber: 1 }),
      this.expenseModel.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalCount / pageSize);

    return {
      expenses,
      pagination: {
        pageIndex,
        pageSize,
        totalCount,
        totalPages,
      },
    };
  }

  async create(dto: ExpenseDto) {
    const newExpense = await this.expenseModel.create({
      expenseType: dto.expenseTypeId,
      supplier: dto.supplierId,
      amount: dto.amount,
      purchases: dto.purchasesIds,
      date: dto.date,
      note: dto.note,
    });

    return this.doExpenseEffects(dto, newExpense._id?.toString());
  }

  async edit(id: string, dto: ExpenseDto) {
    await this.revertExpenseEffects(id);

    const expense = await this.expenseModel.findOneAndUpdate(
      { _id: id },
      {
        expenseType: dto.expenseTypeId,
        supplier: dto.supplierId,
        amount: dto.amount,
        purchases: dto.purchasesIds,
        date: dto.date,
        note: dto.note,
      },
    );
    if (!expense) throw new NotFoundException('Expense not found');

    await this.doExpenseEffects(dto, id);

    return expense;
  }

  async delete(id: string) {
    await this.revertExpenseEffects(id);

    const expense = await this.expenseModel.findOneAndDelete({ _id: id });

    if (!expense) throw new NotFoundException('Expense not found');
    return expense;
  }

  async findOneByExpenseType(expenseTypeId: string) {
    return this.expenseModel.findOne({ expenseType: expenseTypeId });
  }

  async findOneBySupplier(supplierId: string) {
    return this.expenseModel.findOne({ supplier: supplierId });
  }

  private async doExpenseEffects(dto: ExpenseDto, expenseId: string) {
    const actions: string[] = [];

    let transaction: any;
    // senario where expense is paying for purchases
    if (dto.supplierId) {
      const supplier = await this.supplierervice.getOneById(dto.supplierId);
      if (!supplier) throw new NotFoundException('Supplier not found');

      const minLoan = Math.max(supplier.loan - dto.amount, 0);
      supplier.loan = minLoan;
      await supplier.save();

      // get purchases and loop over them and pay them until amount is 0
      if (dto.purchasesIds.length > 0) {
        const purchases = await this.purchaseService.getManyByIds(
          dto.purchasesIds,
        );

        let remainingAmountPaid = dto.amount;

        for (const purchase of purchases) {
          if (remainingAmountPaid <= 0) break;

          const purchaseRemainingAmount =
            purchase.totalAmount - purchase.amountPaid;

          const isPurchasePaid = remainingAmountPaid >= purchaseRemainingAmount;

          const amountToPayPurchase = isPurchasePaid
            ? purchaseRemainingAmount
            : remainingAmountPaid;

          await this.purchaseService.updatePurchasePayments({
            purchaseId: purchase._id?.toString(),
            amountPaid: amountToPayPurchase,
            isPaid: isPurchasePaid,
            expenseLinking: {
              expenseId,
              action: 'add',
            },
          });

          actions.push(
            `Paid purchase ${purchase.invoiceNumber} of amount ${purchaseRemainingAmount}`,
          );

          remainingAmountPaid -= amountToPayPurchase;
        }
      }

      actions.push(`Paid supplier ${supplier.name} loan: ${dto.amount}`);

      // save loan transaction
      transaction = await this.loansTransactionsService.saveLoanTransaction({
        type: 'pay-purchase-loan',
        amount: dto.amount,
        loanRemaining: minLoan,
        supplierId: supplier._id?.toString(),
        customerId: null,
        expenseId: expenseId,
        invoiceId: null,
      });
    }

    // update daily report
    await this.reportService.syncDailyReport({
      date: dto.date,
      totalExpenses: dto.amount,
      totalIncome: 0,
    });

    // update accounting
    await this.accountingService.incAccountingNumberFields({
      totalExpenses: dto.amount, //increase total expenses
      totalSuppliersLoan: dto.supplierId ? -dto.amount : 0, //decrease total suppliers loan
      caisse: -dto.amount, //decrease caisse
    });

    actions.push(`New Expense created of amount ${dto.amount}`);
    await this.transactionsService.saveTransaction({
      whatHappened: actions.join('. '),
      totalAmount: dto.amount,
      discountAmount: 0,
      finalAmount: dto.amount,
      type: 'outcome',
    });

    return transaction;
  }

  private async revertExpenseEffects(expenseId: string) {
    const actions: string[] = [];

    const expense = await this.expenseModel.findById(expenseId).lean();
    if (!expense) {
      throw new BadRequestException('Expense not found');
    }

    // Increase supplier loan
    if (expense.supplier) {
      const supplier = await this.supplierervice.getOneById(
        expense.supplier?.toString(),
      );

      if (supplier) {
        supplier.loan += expense.amount;
        await supplier.save();

        actions.push(
          `Increased supplier ${supplier.name} loan: ${expense.amount}`,
        );
      }

      //-> ignore deleted suppliers

      // undo paying purchases until amount is equal to expense amount
      if (expense.purchases?.length > 0) {
        const purchases = await this.purchaseService.getManyByIds(
          expense.purchases?.map((id) => id.toString()),
        );

        let totalDeducted = 0;
        const targetDeduction = expense.amount; // total you want to deduct

        for (const purchase of purchases) {
          if (totalDeducted >= targetDeduction) break;

          const alreadyPaidAmount = purchase.amountPaid;

          // Calculate how much more we need to deduct
          const remainingToDeduct = targetDeduction - totalDeducted;

          // Deduct only as much as possible without going below zero
          const deductionAmount = Math.min(
            alreadyPaidAmount,
            remainingToDeduct,
          );

          const isPurchaseFullyUnpaid = deductionAmount > 0;

          await this.purchaseService.updatePurchasePayments({
            purchaseId: purchase._id?.toString(),
            amountPaid: -deductionAmount, // negative for deduction
            isPaid: !isPurchaseFullyUnpaid, // update paid status
            expenseLinking: {
              expenseId,
              action: 'remove',
            },
          });

          totalDeducted += deductionAmount;
        }

        if (totalDeducted < targetDeduction) {
          // Handle if you cannot deduct full expense.amount
          throw new Error(
            `Could only deduct ${totalDeducted}, which is less than expense amount ${targetDeduction}`,
          );
        }

        actions.push(`Reverted paying to purchases: ${totalDeducted}`);
      }

      // delete loan transaction
      await this.loansTransactionsService.deleteByExpenseId(expenseId);
    }

    // update daily report
    await this.reportService.syncDailyReport({
      date: expense.date,
      totalExpenses: expense.amount,
    });

    // update accounting
    await this.accountingService.incAccountingNumberFields({
      totalExpenses: -expense.amount, // decrease total expenses
      totalSuppliersLoan: expense.supplier ? expense.amount : 0, // re-add total suppliers loan
      caisse: expense.amount, // re-add caisse
    });

    actions.push(`Expense ${expense._id} reverted of amount ${expense.amount}`);
    await this.transactionsService.saveTransaction({
      whatHappened: actions.join('. '),
      totalAmount: expense.amount,
      discountAmount: 0,
      finalAmount: expense.amount,
      type: 'income',
    });
  }
}
