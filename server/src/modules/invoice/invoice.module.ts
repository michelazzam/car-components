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
    ]),
  ],
  controllers: [InvoiceController],
  providers: [InvoiceService],
})
export class InvoiceModule {}
