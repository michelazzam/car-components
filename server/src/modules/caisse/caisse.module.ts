import { Module } from '@nestjs/common';
import { CaisseService } from './caisse.service';
import { CaisseController } from './caisse.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Accounting, AccountingSchema } from '../accounting/accounting.schema';
import { AccountingModule } from '../accounting/accounting.module';

@Module({
  imports: [
    AccountingModule,
    MongooseModule.forFeature([
      { name: Accounting.name, schema: AccountingSchema },
    ]),
  ],
  controllers: [CaisseController],
  providers: [CaisseService],
})
export class CaisseModule {}
