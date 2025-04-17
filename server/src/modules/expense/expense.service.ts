import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Expense, IExpense } from './expense.schema';
import { FilterQuery, Model } from 'mongoose';
import { AddExpenseDto } from './dto/add-expense.dto';
import { EditExpenseDto } from './dto/edit-expense.dto';
import { GetExpensesDto } from './dto/get-expenses.dto';
import { formatISODate } from 'src/utils/formatIsoDate';

@Injectable()
export class ExpenseService {
  constructor(
    @InjectModel(Expense.name)
    private expenseModel: Model<IExpense>,
  ) {}

  async getAll(dto: GetExpensesDto) {
    const { pageIndex, search, pageSize, expenseTypeId, startDate, endDate } =
      dto;

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
        .limit(pageSize),
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

    return this.expenseModel.find().sort({ createdAt: -1 });
  }

  async create(expense: AddExpenseDto) {
    await this.expenseModel.create(expense);

    // Events:
    // TODO: subtract supplier loan
    // TODO: update accounting
  }

  async edit(id: string, dto: EditExpenseDto) {
    const expense = await this.expenseModel.findOneAndUpdate({ _id: id }, dto);
    // TODO: update accounting

    if (!expense) throw new NotFoundException('Expense not found');
    return expense;
  }

  async delete(id: string) {
    const expense = await this.expenseModel.findOneAndDelete({ _id: id });
    // TODO: update accounting

    if (!expense) throw new NotFoundException('Expense not found');
    return expense;
  }
}
