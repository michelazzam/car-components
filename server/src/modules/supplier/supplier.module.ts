import { Module } from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { SupplierController } from './supplier.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Supplier, SupplierSchema } from './supplier.schema';
import { Purchase, PurchaseSchema } from '../purchase/purchase.schema';
import { Expense, ExpenseSchema } from '../expense/expense.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Supplier.name, schema: SupplierSchema },
      { name: Purchase.name, schema: PurchaseSchema },
      { name: Expense.name, schema: ExpenseSchema },
    ]),
  ],
  controllers: [SupplierController],
  providers: [SupplierService],
  exports: [SupplierService],
})
export class SupplierModule {}
