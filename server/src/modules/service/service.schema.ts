import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class Service {
  @Prop({ required: true })
  name: string;

  @Prop({ default: 0 })
  price: number;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export type IService = HydratedDocument<Service>;

export const ServiceSchema = SchemaFactory.createForClass(Service);
