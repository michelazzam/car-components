import { Injectable } from '@nestjs/common';
import {
  ITransaction,
  Transaction,
  TransactionType,
} from './transactions.schema';
import { FilterQuery, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { GetTransactionsDto } from './dto/get-transactions.dto';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction.name)
    private transactionModel: Model<ITransaction>,
  ) {}

  async getAll(dto: GetTransactionsDto) {
    try {
      const {
        pageIndex,
        search,
        pageSize,
        transactionType,
        startDate,
        endDate,
      } = dto;

      const filter: FilterQuery<ITransaction> = {};

      // Add search filter
      if (search) {
        filter.$or = [{ whatHappened: { $regex: search, $options: 'i' } }];
      }

      if (transactionType) {
        filter.type = transactionType;
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
        filter.createdAt = dateFilter;
      }

      const [transactions, totalCount] = await Promise.all([
        this.transactionModel
          .find(filter)
          .sort({ createdAt: -1 })
          .skip(pageIndex * pageSize)
          .limit(pageSize),
        this.transactionModel.countDocuments(filter),
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
    } catch (error) {
      console.log(error);
    }
  }

  async saveTransaction({
    whatHappened,
    totalAmount,
    discountAmount,
    finalAmount,
    type,
  }: {
    whatHappened: string;
    totalAmount: number;
    discountAmount: number;
    finalAmount: number;
    type: TransactionType;
  }) {
    await this.transactionModel.create({
      whatHappened,
      totalAmount,
      discountAmount,
      finalAmount,
      type,
    });
  }
}
