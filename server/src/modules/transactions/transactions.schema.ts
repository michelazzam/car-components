import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export const transactionTypes = ['none', 'income', 'outcome'] as const;
export type TransactionType = (typeof transactionTypes)[number];

@Schema({ timestamps: true })
export class Transaction {
  @Prop({ required: true })
  whatHappened: string;

  @Prop({ default: 0 })
  totalAmount: number;

  @Prop({ default: 0 })
  discountAmount: number;

  @Prop({ default: 0 })
  finalAmount: number;

  @Prop({ enum: transactionTypes, required: true })
  type: TransactionType;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export type ITransaction = HydratedDocument<Transaction>;

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
