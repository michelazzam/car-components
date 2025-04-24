import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ timestamps: true })
export class ExpenseType {
  @Prop({ required: true })
  name: string;
}

export type IExpenseType = HydratedDocument<ExpenseType>;

export const ExpenseTypeSchema = SchemaFactory.createForClass(ExpenseType);
