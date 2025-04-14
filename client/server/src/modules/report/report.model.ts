import mongoose from "mongoose";

export interface IReport {
  _id: string;
  date: string;
  totalIncome: number;
  totalExpenses: number;
}

const ReportSchema = new mongoose.Schema<IReport>(
  {
    date: {
      type: String,
      required: true,
      unique: true,
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
    timestamps: true,
  }
);

const Report = mongoose.model("Report", ReportSchema);
export default Report;
