import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class Supplier {
  @Prop({ required: true })
  name: string;

  @Prop({ default: 0 })
  amountDue: number;

  @Prop()
  capital: string;

  @Prop()
  poBox: string;

  @Prop()
  address: string;

  @Prop()
  phoneNumber: string;

  @Prop()
  fax: string;

  @Prop()
  ext: string;

  @Prop()
  email: string;

  @Prop()
  website: string;

  @Prop()
  vatNumber: string;

  @Prop()
  extraInfo: string;

  @Prop({ default: 0 })
  loan: number;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export type ISupplier = HydratedDocument<Supplier>;

export const SupplierSchema = SchemaFactory.createForClass(Supplier);
