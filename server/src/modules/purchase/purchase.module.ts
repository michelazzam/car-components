import { Module } from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { PurchaseController } from './purchase.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Purchase, PurchaseSchema } from './purchase.schema';
import { AccountingModule } from '../accounting/accounting.module';
import { SupplierModule } from '../supplier/supplier.module';
import { ItemModule } from '../item/item.module';
import { Expense, ExpenseSchema } from '../expense/expense.schema';
import { LoansTransactionsModule } from '../loans-transactions/loans-transactions.module';
import { TransactionsModule } from '../transactions/transactions.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Purchase.name, schema: PurchaseSchema },
      { name: Expense.name, schema: ExpenseSchema },
    ]),
    AccountingModule,
    SupplierModule,
    ItemModule,
    TransactionsModule,
    LoansTransactionsModule,
  ],
  controllers: [PurchaseController],
  providers: [PurchaseService],
  exports: [PurchaseService],
})
export class PurchaseModule {}
