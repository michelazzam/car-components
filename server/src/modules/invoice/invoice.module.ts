import { Module } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { InvoiceController } from './invoice.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Invoice,
  InvoiceCounter,
  InvoiceCounterSchema,
  InvoiceSchema,
} from './invoice.schema';
import { Item, ItemSchema } from '../item/item.schema';
import { Service, ServiceSchema } from '../service/service.schema';
import { Customer, CustomerSchema } from '../customer/customer.schema';
import { AccountingModule } from '../accounting/accounting.module';
import { OrganizationModule } from '../organization/organization.module';
import { ReportModule } from '../report/report.module';

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
      { name: Item.name, schema: ItemSchema },
      { name: Service.name, schema: ServiceSchema },
      { name: Customer.name, schema: CustomerSchema },
    ]),
    AccountingModule,
    OrganizationModule,
    ReportModule,
  ],
  controllers: [InvoiceController],
  providers: [InvoiceService],
})
export class InvoiceModule {}
