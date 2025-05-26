import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

@Schema({ timestamps: true })
export class Purchase {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' })
  supplier: mongoose.Types.ObjectId;

  @Prop({ required: true })
  invoiceNumber: string;

  @Prop({ required: true })
  invoiceDate: string;

  @Prop({ required: false })
  customerConsultant: string;

  @Prop({ required: false })
  phoneNumber: string;

  @Prop({ required: true })
  usdRate: number;

  @Prop({ required: true })
  vatPercent: number;

  @Prop({ required: true })
  vatLBP: number;

  @Prop({ required: true })
  subTotal: number;

  @Prop({ required: true })
  totalAmount: number;

  @Prop({ required: true })
  amountPaid: number;

  // saving it for later reference (when we want to delete purchase so we know that we should delete the expense)
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Expense' })
  expense: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  items: {
    item: mongoose.Schema.Types.ObjectId;
    name: string;
    description: string;
    price: number;
    quantity: number;
    quantityFree: number;
    currentItemCost: number;
    discount: number;
    lotNumber: string;
    expDate: string;
    totalPrice: number;
  }[];
}

export type IPurchase = HydratedDocument<Purchase>;

export const PurchaseSchema = SchemaFactory.createForClass(Purchase);
