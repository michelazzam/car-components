import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ timestamps: true })
export class PaymentMethod {
  @Prop({ required: true })
  method: string;
}

export type IPaymentMethod = HydratedDocument<PaymentMethod>;

export const PaymentMethodSchema = SchemaFactory.createForClass(PaymentMethod);
