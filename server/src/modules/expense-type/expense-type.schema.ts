import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class ExpenseType {
  @Prop({ required: true })
  name: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export type IExpenseType = HydratedDocument<ExpenseType>;

export const ExpenseTypeSchema = SchemaFactory.createForClass(ExpenseType);
