import { Module } from '@nestjs/common';
import { ExpenseTypeService } from './expense-type.service';
import { ExpenseTypeController } from './expense-type.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ExpenseType, ExpenseTypeSchema } from './expense-type.schema';
import { ExpenseModule } from '../expense/expense.module';

@Module({
  imports: [
    // configure model to be used in this Module
    MongooseModule.forFeature([
      { name: ExpenseType.name, schema: ExpenseTypeSchema },
    ]),
    ExpenseModule,
  ],
  controllers: [ExpenseTypeController],
  providers: [ExpenseTypeService],
})
export class ExpenseTypeModule {}
