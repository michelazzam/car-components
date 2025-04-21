import { Module } from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { PurchaseController } from './purchase.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Purchase, PurchaseSchema } from './purchase.schema';
import { Item, ItemSchema } from '../item/item.schema';
import { Supplier, SupplierSchema } from '../supplier/supplier.schema';
import { AccountingModule } from '../accounting/accounting.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Purchase.name, schema: PurchaseSchema },
      { name: Item.name, schema: ItemSchema },
      { name: Supplier.name, schema: SupplierSchema },
    ]),
    AccountingModule,
  ],
  controllers: [PurchaseController],
  providers: [PurchaseService],
})
export class PurchaseModule {}
