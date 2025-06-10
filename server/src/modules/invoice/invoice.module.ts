import { forwardRef, Module } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { InvoiceController } from './invoice.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Invoice,
  InvoiceCounter,
  InvoiceCounterSchema,
  InvoiceSchema,
} from './invoice.schema';
import { AccountingModule } from '../accounting/accounting.module';
import { ReportModule } from '../report/report.module';
import { CustomerModule } from '../customer/customer.module';
import { ServiceModule } from '../service/service.module';
import { ItemModule } from '../item/item.module';
import { LoansTransactionsModule } from '../loans-transactions/loans-transactions.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Invoice.name,
        schema: InvoiceSchema,
      },
      {
        name: InvoiceCounter.name,
        schema: InvoiceCounterSchema,
      },
    ]),
    AccountingModule,
    forwardRef(() => ReportModule), //to avoid circular dependency
    forwardRef(() => CustomerModule),
    ServiceModule,
    ItemModule,
    LoansTransactionsModule,
  ],
  controllers: [InvoiceController],
  providers: [InvoiceService],
  exports: [InvoiceService],
})
export class InvoiceModule {}
