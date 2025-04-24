import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

@Schema({ timestamps: true })
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
}
export const VehicleSchema = SchemaFactory.createForClass(Vehicle);
export type IVehicle = HydratedDocument<Vehicle>;

@Schema({ timestamps: true })
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
}

export type ICustomer = HydratedDocument<Customer>;

export const CustomerSchema = SchemaFactory.createForClass(Customer);
