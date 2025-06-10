import { Controller, Get, Query } from '@nestjs/common';
import { LoansTransactionsService } from './loans-transactions.service';
import { ApiTags } from '@nestjs/swagger';
import { IsPublic } from '../user/decorators/isPublic.decorator';
import { GetLoansTransactionsDto } from './dto/get-loans-transactions.dto';

@IsPublic()
@ApiTags('Loans Transactions')
@Controller({ version: '1', path: 'loans-transactions' })
export class LoansTransactionsController {
  constructor(
    private readonly loansTransactionsService: LoansTransactionsService,
  ) {}

  @Get()
  findAll(@Query() dto: GetLoansTransactionsDto) {
    return this.loansTransactionsService.getAll(dto);
  }
}
