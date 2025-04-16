import mongoose from "mongoose";

export interface IService extends mongoose.Document {
  name: string;
}

const ServiceSchema = new mongoose.Schema<IService>(
  {
    name: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Service = mongoose.model("Service", ServiceSchema);
export default Service;
