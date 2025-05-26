import { Module } from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { PurchaseController } from './purchase.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Purchase, PurchaseSchema } from './purchase.schema';
import { AccountingModule } from '../accounting/accounting.module';
import { SupplierModule } from '../supplier/supplier.module';
import { ItemModule } from '../item/item.module';
import { ExpenseModule } from '../expense/expense.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Purchase.name, schema: PurchaseSchema },
    ]),
    AccountingModule,
    SupplierModule,
    ExpenseModule,
    ItemModule,
  ],
  controllers: [PurchaseController],
  providers: [PurchaseService],
})
export class PurchaseModule {}
