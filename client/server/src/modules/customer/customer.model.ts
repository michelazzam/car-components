import mongoose from "mongoose";

export interface ICustomer {
  name: string;
  phone: string;
  email: string;
  address: string;
  tvaNumber: string;
  note: string;
  loan: number;
  totalVehicles: number;
}

const CustomerSchema = new mongoose.Schema<ICustomer>(
  {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
    },
    address: {
      type: String,
    },
    tvaNumber: {
      type: String,
    },
    note: {
      type: String,
    },
    loan: {
      type: Number,
      default: 0,
    },
    totalVehicles: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Customer = mongoose.model("Customer", CustomerSchema);
export default Customer;
