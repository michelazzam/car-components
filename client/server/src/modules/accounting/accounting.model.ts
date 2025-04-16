import mongoose from "mongoose";

interface IAccounting {
  _id: string;
  usdRate: number;
  totalIncome: number;
  totalExpenses: number;
}

export const accountingId = "unique_accounting_id";
const accountingSchema = new mongoose.Schema<IAccounting>(
  {
    _id: {
      type: String,
      default: "unique_accounting_id",
    },

    usdRate: {
      type: Number,
      required: true,
      default: 0,
    },

    totalIncome: {
      type: Number,
      required: true,
      default: 0,
    },

    totalExpenses: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: false,
    _id: false,
  }
);

const Accounting = mongoose.model("Accounting", accountingSchema);
export default Accounting;
