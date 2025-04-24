import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ timestamps: true })
export class Accounting {
  @Prop({ required: true, default: 89000 })
  usdRate: number;

  @Prop({ default: 0 })
  totalIncome: number;

  @Prop({ default: 0 })
  totalExpenses: number;

  @Prop({ default: 0 })
  totalCustomersLoan: number;

  @Prop({ default: 0 })
  totalSuppliersLoan: number;
}

export type IAccounting = HydratedDocument<Accounting>;

export const AccountingSchema = SchemaFactory.createForClass(Accounting);
