import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

const transactionTypes = [
  'new-invoice',
  'pay-invoice-loan',
  'new-purchase',
  'pay-purchase-loan',
] as const;
export type LoanTransactionType = (typeof transactionTypes)[number];

@Schema({ timestamps: true })
export class LoansTransactions {
  @Prop({ enum: transactionTypes, required: true })
  type: LoanTransactionType;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' })
  supplier: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Customer' })
  customer: mongoose.Types.ObjectId;

  @Prop({ default: 0 })
  amount: number;

  @Prop({ default: 0 })
  loanRemaining: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Expense' })
  expense: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Invoice' })
  invoice: mongoose.Types.ObjectId;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export type ILoansTransactions = HydratedDocument<LoansTransactions>;

export const LoansTransactionsSchema =
  SchemaFactory.createForClass(LoansTransactions);
