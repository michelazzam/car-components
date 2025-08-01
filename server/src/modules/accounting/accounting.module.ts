import { Module } from '@nestjs/common';
import { AccountingService } from './accounting.service';
import { AccountingController } from './accounting.controller';
import { Accounting, AccountingSchema } from './accounting.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { SupplierModule } from '../supplier/supplier.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Accounting.name, schema: AccountingSchema },
    ]),
    SupplierModule,
  ],
  controllers: [AccountingController],
  providers: [AccountingService],
  exports: [AccountingService],
})
export class AccountingModule {}
