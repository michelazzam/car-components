import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export const discountTypes = ['percentage', 'fixed'] as const;
export type DiscountType = (typeof discountTypes)[number];

export const invoiceTypes = ['s1', 's2'] as const;
export type InvoiceType = (typeof invoiceTypes)[number];

@Schema({ timestamps: true })
export class Invoice {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Customer' })
  customer: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' })
  vehicle: mongoose.Types.ObjectId;

  @Prop()
  number: string;

  @Prop({ enum: invoiceTypes, required: true })
  type: InvoiceType;

  @Prop()
  paymentMethods: {
    method: string;
    note?: string;
  }[];

  @Prop({ required: true, type: Object })
  accounting: {
    isPaid: boolean;
    usdRate: number;

    discount: {
      amount: number;
      type: DiscountType;
    };
    taxesUsd: number;

    subTotalUsd: number;
    totalUsd: number;

    paidAmountUsd: number;
  };

  @Prop()
  customerNote: string;

  @Prop({ required: true })
  items: {
    itemRef: mongoose.Schema.Types.ObjectId;
    serviceRef: mongoose.Schema.Types.ObjectId;
    name: string;
    cost: number;
    price: number;
    quantity: number;
    discount: {
      amount: number;
      type: DiscountType;
    };
    subTotal: number;
    totalPrice: number;
  }[];

  @Prop({ default: Date.now })
  createdAt: Date;
}

export type IInvoice = HydratedDocument<Invoice>;

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);

// The counter for both s1 and s2 invoices
@Schema({ timestamps: true })
export class InvoiceCounter {
  @Prop({ required: true })
  year: string;
  @Prop({ required: true, default: 0 })
  seq: number;
  @Prop({ required: true, enum: invoiceTypes })
  type: InvoiceType;
}
export type IInvoiceCounter = HydratedDocument<InvoiceCounter>;
export const InvoiceCounterSchema =
  SchemaFactory.createForClass(InvoiceCounter);
