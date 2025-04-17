import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

@Schema()
export class Purchase {
  @Prop({ type: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' } })
  supplier: mongoose.Types.ObjectId;

  @Prop({ required: true })
  invoiceNumber: string;

  @Prop({ required: true })
  invoiceDate: string;

  @Prop({ required: true })
  customerConsultant: string;

  @Prop({ required: true })
  phoneNumber: string;

  @Prop({ required: true })
  vatPercent: number;

  @Prop({ required: true })
  vatLBP: number;

  @Prop({ required: true })
  totalAmount: number;

  @Prop({ required: true })
  items: {
    item: mongoose.Schema.Types.ObjectId;
    name: string;
    description: string;
    price: number;
    quantity: number;
    quantityFree: number;
    discount: number;
    lotNumber: string;
    expDate: string;
    totalPrice: number;
  }[];

  @Prop({ default: Date.now })
  createdAt: Date;
}

export type IPurchase = HydratedDocument<Purchase>;

export const PurchaseSchema = SchemaFactory.createForClass(Purchase);
