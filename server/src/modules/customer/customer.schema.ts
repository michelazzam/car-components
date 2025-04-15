import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class Vehicle {
  @Prop({ required: true })
  make: string;

  @Prop({ required: true })
  model: string;

  @Prop({ required: true })
  number: string;

  @Prop({ required: true })
  odometer: number;

  @Prop({ default: Date.now })
  createdAt: Date;
}
const VehicleSchema = SchemaFactory.createForClass(Vehicle);

@Schema()
export class Customer {
  @Prop({ required: true })
  name: string;

  @Prop()
  email: string;

  @Prop({ unique: true, required: true })
  phoneNumber: string;

  @Prop()
  tvaNumber: string;

  @Prop()
  address: string;

  @Prop()
  note: string;

  @Prop({ default: 0 })
  loan: number;

  @Prop({ type: [VehicleSchema], default: [] })
  vehicles: Vehicle[];

  @Prop({ default: Date.now })
  createdAt: Date;
}

export type ICustomer = HydratedDocument<Customer>;

export const CustomerSchema = SchemaFactory.createForClass(Customer);
