import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ timestamps: true })
export class Service {
  @Prop({ required: true })
  name: string;

  @Prop({ default: 0 })
  price: number;
}

export type IService = HydratedDocument<Service>;

export const ServiceSchema = SchemaFactory.createForClass(Service);
