import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ExpenseTypeService } from './expense-type.service';
import { ApiTags } from '@nestjs/swagger';
import { EditExpenseTypeDto } from './dto/edit-expense-type.dto';
import { AddExpenseTypeDto } from './dto/add-expense-type.dto';
import { Roles } from '../user/decorators/roles.decorator';
import { Permissions } from '../user/decorators/permissions.decorator';

@ApiTags('Expense type')
@Controller({ version: '1', path: 'expense-type' })
export class ExpenseTypeController {
  constructor(private readonly expenseTypeService: ExpenseTypeService) {}

  @Permissions('Expenses', 'read')
  @Get()
  async getAll() {
    return this.expenseTypeService.getAll();
  }

  @Permissions('Expenses', 'create')
  @Post()
  async create(@Body() dto: AddExpenseTypeDto) {
    const createdExpenseType = await this.expenseTypeService.create(dto);

    return {
      message: 'Expense type added successfully',
      data: createdExpenseType,
    };
  }

  @Permissions('Expenses', 'update')
  @Put(':id')
  async edit(@Param('id') id: string, @Body() dto: EditExpenseTypeDto) {
    await this.expenseTypeService.edit(id, dto);

    return { message: 'Expense type updated successfully' };
  }

  @Roles('admin', 'superAmsAdmin')
  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.expenseTypeService.delete(id);

    return { message: 'Expense type deleted successfully' };
  }
}
