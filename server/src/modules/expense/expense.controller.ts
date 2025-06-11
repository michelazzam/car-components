import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { ApiTags } from '@nestjs/swagger';
import { ExpenseDto } from './dto/expense.dto';
import { GetExpensesDto } from './dto/get-expenses.dto';
import { Roles } from '../user/decorators/roles.decorator';
import { Permissions } from '../user/decorators/permissions.decorator';

@ApiTags('Expense')
@Controller({ version: '1', path: 'expense' })
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @Permissions('Expenses', 'read')
  @Get()
  async getAll(@Query() dto: GetExpensesDto) {
    return this.expenseService.getAll(dto);
  }

  @Permissions('Expenses', 'create')
  @Post()
  async create(@Body() dto: ExpenseDto) {
    const transaction = await this.expenseService.create(dto);

    return { message: 'Expense added successfully', data: { transaction } };
  }

  @Permissions('Expenses', 'update')
  @Put(':id')
  async edit(@Param('id') id: string, @Body() dto: ExpenseDto) {
    const { transaction, expense } = await this.expenseService.edit(id, dto);

    return {
      message: 'Expense updated successfully',
      data: { transaction, expense },
    };
  }

  @Roles('admin', 'superAmsAdmin')
  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.expenseService.delete(id);

    return { message: 'Expense deleted successfully' };
  }
}
