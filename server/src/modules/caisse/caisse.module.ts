import { Module } from '@nestjs/common';
import { CaisseService } from './caisse.service';
import { CaisseController } from './caisse.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AccountingModule } from '../accounting/accounting.module';
import { CaisseHistory, CaisseHistorySchema } from './caisse.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CaisseHistory.name, schema: CaisseHistorySchema },
    ]),
    AccountingModule,
  ],
  controllers: [CaisseController],
  providers: [CaisseService],
})
export class CaisseModule {}
