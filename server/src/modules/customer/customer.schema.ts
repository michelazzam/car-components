import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

@Schema()
export class Vehicle {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Customer' })
  customer: mongoose.Types.ObjectId;

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
export const VehicleSchema = SchemaFactory.createForClass(Vehicle);
export type IVehicle = HydratedDocument<Vehicle>;

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

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' }],
    default: [],
  })
  vehicles: mongoose.Types.ObjectId[];

  @Prop({ default: Date.now })
  createdAt: Date;
}

export type ICustomer = HydratedDocument<Customer>;

export const CustomerSchema = SchemaFactory.createForClass(Customer);
