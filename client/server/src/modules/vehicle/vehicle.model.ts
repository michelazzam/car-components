import mongoose from "mongoose";

export const gasTypes = ["GASOLINE", "DIESEL"] as const;
export type GasType = (typeof gasTypes)[number];

export interface IVehicle {
  vehicleNb: string;
  model: string;
  gasType: mongoose.Types.ObjectId;
  lastServiceDate: Date;
  customer: mongoose.Types.ObjectId;
}

const VehicleSchema = new mongoose.Schema<IVehicle>(
  {
    vehicleNb: {
      type: String,
      required: true,
      unique: true,
    },
    model: {
      type: String,
      required: true,
    },
    gasType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GasType",
      required: true,
    },
    lastServiceDate: {
      type: Date,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Vehicle = mongoose.model("Vehicle", VehicleSchema);
export default Vehicle;
