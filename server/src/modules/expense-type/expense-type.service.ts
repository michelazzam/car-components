import { Injectable, NotFoundException } from '@nestjs/common';
import { ExpenseType, IExpenseType } from './expense-type.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AddExpenseTypeDto } from './dto/add-expense-type.dto';
import { EditExpenseTypeDto } from './dto/edit-expense-type.dto';

@Injectable()
export class ExpenseTypeService {
  constructor(
    @InjectModel(ExpenseType.name)
    private expenseModel: Model<IExpenseType>,
  ) {}

  async getAll() {
    return this.expenseModel.find().sort({ createdAt: -1 });
  }

  async create(expenseType: AddExpenseTypeDto) {
    return await this.expenseModel.create(expenseType);
  }

  async edit(id: string, dto: EditExpenseTypeDto) {
    const expenseType = await this.expenseModel.findOneAndUpdate(
      { _id: id },
      dto,
    );

    if (!expenseType) throw new NotFoundException('Expense type not found');
    return expenseType;
  }

  async delete(id: string) {
    const expenseType = await this.expenseModel.findOneAndDelete({ _id: id });

    if (!expenseType) throw new NotFoundException('Expense type not found');
    return expenseType;
  }
}
