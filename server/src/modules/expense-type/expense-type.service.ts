import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ExpenseType, IExpenseType } from './expense-type.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AddExpenseTypeDto } from './dto/add-expense-type.dto';
import { EditExpenseTypeDto } from './dto/edit-expense-type.dto';
import { ExpenseService } from '../expense/expense.service';

@Injectable()
export class ExpenseTypeService {
  constructor(
    @InjectModel(ExpenseType.name)
    private expenseTypeModel: Model<IExpenseType>,
    private expenseService: ExpenseService,
  ) {}

  async getAll() {
    return this.expenseTypeModel.find().sort({ createdAt: -1 });
  }

  async create(expenseType: AddExpenseTypeDto) {
    return await this.expenseTypeModel.create(expenseType);
  }

  async edit(id: string, dto: EditExpenseTypeDto) {
    const expenseType = await this.expenseTypeModel.findOneAndUpdate(
      { _id: id },
      dto,
    );

    if (!expenseType) throw new NotFoundException('Expense type not found');
    return expenseType;
  }

  async delete(id: string) {
    // do not allow deleting if used by any expense
    const expense = await this.expenseService.findOneByExpenseType(id);
    if (expense)
      throw new BadRequestException(
        'Can not delete Expense type that is used by an expense',
      );

    const expenseType = await this.expenseTypeModel.findOneAndDelete({
      _id: id,
    });

    if (!expenseType) throw new NotFoundException('Expense type not found');
    return expenseType;
  }
}
