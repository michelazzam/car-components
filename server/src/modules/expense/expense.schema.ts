import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

// suppier & invoice to be added once I start the business logic
@Schema()
export class Expense {
  @Prop({ required: true })
  date: string;

  @Prop({ required: true })
  amount: number;

  @Prop()
  note: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'ExpenseType' })
  expenseType: mongoose.Types.ObjectId;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export type IExpense = HydratedDocument<Expense>;

export const ExpenseSchema = SchemaFactory.createForClass(Expense);
