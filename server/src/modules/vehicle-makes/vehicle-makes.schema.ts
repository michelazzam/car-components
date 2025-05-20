import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

@Schema()
export class VehicleModel {
  @Prop({ required: true })
  name: string;
}

type IVehicleModel = HydratedDocument<VehicleModel>;
const VehicleModelSchema = SchemaFactory.createForClass(VehicleModel);

@Schema({ timestamps: true })
export class VehicleMakes {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ type: [VehicleModelSchema], default: [] })
  models: Types.DocumentArray<IVehicleModel>;
}

export type IVehicleMakes = HydratedDocument<VehicleMakes>;
export const VehicleMakesSchema = SchemaFactory.createForClass(VehicleMakes);
