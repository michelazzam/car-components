import { Module } from '@nestjs/common';
import { AccountingService } from './accounting.service';
import { AccountingController } from './accounting.controller';
import { Accounting, AccountingSchema } from './accounting.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Accounting.name, schema: AccountingSchema },
    ]),
  ],
  controllers: [AccountingController],
  providers: [AccountingService],
})
export class AccountingModule {}
