import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { ApiTags } from '@nestjs/swagger';
import { EditExpenseDto } from './dto/edit-expense.dto';
import { AddExpenseDto } from './dto/add-expense.dto';

@ApiTags('Expense')
@Controller({ version: '1', path: 'expense' })
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @Get()
  async getAll() {
    return this.expenseService.getAll();
  }

  @Post()
  async create(@Body() dto: AddExpenseDto) {
    await this.expenseService.create(dto);

    return { message: 'Expense added successfully' };
  }

  @Put(':id')
  async edit(@Param('id') id: string, @Body() dto: EditExpenseDto) {
    await this.expenseService.edit(id, dto);

    return { message: 'Expense updated successfully' };
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.expenseService.delete(id);

    return { message: 'Expense deleted successfully' };
  }
}
