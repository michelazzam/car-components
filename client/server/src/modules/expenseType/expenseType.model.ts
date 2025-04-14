import mongoose from "mongoose";

interface IExpenseType {
  title: string;
}

const ExpenseTypeSchema = new mongoose.Schema<IExpenseType>(
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

const ExpenseType = mongoose.model("ExpenseType", ExpenseTypeSchema);
export default ExpenseType;
