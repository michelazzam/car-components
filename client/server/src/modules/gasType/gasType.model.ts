import mongoose from "mongoose";

interface IGasType {
  title: string;
}

const GasTypeSchema = new mongoose.Schema<IGasType>(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

const GasType = mongoose.model("GasType", GasTypeSchema);
export default GasType;
