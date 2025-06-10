import { Module } from '@nestjs/common';
import { LoansTransactionsService } from './loans-transactions.service';
import { LoansTransactionsController } from './loans-transactions.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  LoansTransactions,
  LoansTransactionsSchema,
} from './loans-transactions.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: LoansTransactions.name,
        schema: LoansTransactionsSchema,
      },
    ]),
  ],
  controllers: [LoansTransactionsController],
  providers: [LoansTransactionsService],
  exports: [LoansTransactionsService],
})
export class LoansTransactionsModule {}
