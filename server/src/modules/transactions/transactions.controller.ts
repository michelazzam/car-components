import { Controller, Get, Query } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { Roles } from '../user/decorators/roles.decorator';
import { GetTransactionsDto } from './dto/get-transactions.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Transactions')
@Controller({ version: '1', path: 'transactions' })
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Roles('superAmsAdmin')
  @Get()
  async getAll(@Query() dto: GetTransactionsDto) {
    return this.transactionsService.getAll(dto);
  }
}
