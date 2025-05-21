import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ timestamps: true })
export class CaisseHistory {
  @Prop({ required: true })
  date: string;

  @Prop({ default: 0 })
  openedAmount: number;

  @Prop({ default: 0 })
  closedAmount: number;

  @Prop({ default: 0 })
  expectedAmountToClose: number;

  @Prop()
  openedAt: Date;

  @Prop()
  closedAt: Date;
}

export type ICaisseHistory = HydratedDocument<CaisseHistory>;

export const CaisseHistorySchema = SchemaFactory.createForClass(CaisseHistory);
