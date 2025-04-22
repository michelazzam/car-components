import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class Report {
  @Prop({ required: true })
  date: string;

  @Prop({ default: 0 })
  totalIncome: number;

  @Prop({ default: 0 })
  totalExpenses: number;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export type IReport = HydratedDocument<Report>;

export const ReportSchema = SchemaFactory.createForClass(Report);
