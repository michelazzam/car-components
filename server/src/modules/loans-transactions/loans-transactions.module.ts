import { Module } from '@nestjs/common';
import { LoansTransactionsService } from './loans-transactions.service';
import { LoansTransactionsController } from './loans-transactions.controller';
import { getConnectionToken, MongooseModule } from '@nestjs/mongoose';
import {
  LoansTransactions,
  LoansTransactionsSchema,
} from './loans-transactions.schema';
import { Connection } from 'mongoose';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: LoansTransactions.name,
        useFactory: async (connection: Connection) => {
          const schema = LoansTransactionsSchema;
          const AutoIncrement = require('mongoose-sequence')(connection);
          schema.plugin(AutoIncrement, { inc_field: 'number' });
          return schema;
        },
        inject: [getConnectionToken()],
      },
    ]),
  ],
  controllers: [LoansTransactionsController],
  providers: [LoansTransactionsService],
  exports: [LoansTransactionsService],
})
export class LoansTransactionsModule {}
