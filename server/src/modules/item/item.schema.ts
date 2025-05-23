import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export const itemStatuses = ['new', 'used'] as const;
export type ItemStatus = (typeof itemStatuses)[number];

@Schema({ timestamps: true })
export class Item {
  @Prop({ required: true })
  name: string;

  @Prop({ required: false })
  note: string;

  @Prop({ default: 0, required: true })
  cost: number;

  @Prop({ default: 0, required: true })
  price: number;

  @Prop({ default: 0, required: true })
  quantity: number;

  @Prop({ enum: itemStatuses, required: true })
  status: ItemStatus;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' })
  supplier: mongoose.Types.ObjectId;
}

export type IItem = HydratedDocument<Item>;

export const ItemSchema = SchemaFactory.createForClass(Item);
