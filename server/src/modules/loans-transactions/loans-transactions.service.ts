import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  ILoansTransactions,
  LoansTransactions,
  LoanTransactionType,
} from './loans-transactions.schema';
import { FilterQuery, Model } from 'mongoose';
import { GetLoansTransactionsDto } from './dto/get-loans-transactions.dto';

@Injectable()
export class LoansTransactionsService {
  constructor(
    @InjectModel(LoansTransactions.name)
    private loansTransactionsModel: Model<ILoansTransactions>,
  ) {}

  async getAll(dto: GetLoansTransactionsDto) {
    const { pageIndex, pageSize, startDate, endDate, supplierId, customerId } =
      dto;

    const filter: FilterQuery<ILoansTransactions> = { $and: [{ $or: [] }] };

    if (supplierId) {
      // @ts-ignore
      filter.$and[0].$or.push({ supplier: supplierId });
    }

    if (customerId) {
      // @ts-ignore
      filter.$and[0].$or.push({ customer: customerId });
    }

    // Add date range filter
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

    const [transactions, totalCount] = await Promise.all([
      this.loansTransactionsModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(pageIndex * pageSize)
        .limit(pageSize)
        .populate('supplier')
        .populate('customer'),
      this.loansTransactionsModel.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalCount / pageSize);

    return {
      transactions,
      pagination: {
        pageIndex,
        pageSize,
        totalCount,
        totalPages,
      },
    };
  }

  async saveLoanTransaction({
    type,
    amount,
    loanRemaining,
    supplierId,
    customerId,
    expenseId,
    invoiceId,
  }: {
    type: LoanTransactionType;
    amount: number;
    loanRemaining: number;
    supplierId: string | null;
    customerId: string | null;
    expenseId: string | null;
    invoiceId: string | null;
  }) {
    return this.loansTransactionsModel.create({
      type,
      amount,
      loanRemaining,
      supplier: supplierId,
      customer: customerId,
      expense: expenseId,
      invoice: invoiceId,
    });
  }

  deleteByExpenseId(expenseId: string) {
    return this.loansTransactionsModel.deleteOne({
      expense: expenseId,
    });
  }

  deleteByInvoiceId(invoiceId: string) {
    return this.loansTransactionsModel.deleteOne({
      invoice: invoiceId,
    });
  }
}
