import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Expense, IExpense } from './expense.schema';
import { Model } from 'mongoose';
import { AddExpenseDto } from './dto/add-expense.dto';
import { EditExpenseDto } from './dto/edit-expense.dto';

@Injectable()
export class ExpenseService {
  constructor(
    @InjectModel(Expense.name)
    private expenseModel: Model<IExpense>,
  ) {}

  async getAll() {
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
