import { Module } from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { ExpenseController } from './expense.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Expense, ExpenseSchema } from './expense.schema';
import { Supplier, SupplierSchema } from '../supplier/supplier.schema';
import { AccountingModule } from '../accounting/accounting.module';
import { ReportModule } from '../report/report.module';

@Module({
  imports: [
    // configure model to be used in this Module
    MongooseModule.forFeature([
      { name: Expense.name, schema: ExpenseSchema },
      { name: Supplier.name, schema: SupplierSchema },
    ]),
    AccountingModule,
    ReportModule,
  ],
  controllers: [ExpenseController],
  providers: [ExpenseService],
})
export class ExpenseModule {}
