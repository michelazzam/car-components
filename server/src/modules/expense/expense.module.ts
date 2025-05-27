import { Module } from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { ExpenseController } from './expense.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Expense, ExpenseSchema } from './expense.schema';
import { AccountingModule } from '../accounting/accounting.module';
import { ReportModule } from '../report/report.module';
import { SupplierModule } from '../supplier/supplier.module';
import { PurchaseModule } from '../purchase/purchase.module';

@Module({
  imports: [
    // configure model to be used in this Module
    MongooseModule.forFeature([{ name: Expense.name, schema: ExpenseSchema }]),
    AccountingModule,
    ReportModule,
    SupplierModule,
    PurchaseModule,
  ],
  controllers: [ExpenseController],
  providers: [ExpenseService],
  exports: [ExpenseService],
})
export class ExpenseModule {}
