import mongoose from "mongoose";

export interface IExpense {
  expenseType: mongoose.Types.ObjectId;
  date: string;
  amount: number;
  note: string;
}

const ExpenseSchema = new mongoose.Schema<IExpense>(
  {
    expenseType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ExpenseType",
    },
    date: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    note: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Expense = mongoose.model("Expense", ExpenseSchema);
export default Expense;
