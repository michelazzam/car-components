import { Request, Response } from "express";
import ExpenseType from "./expenseType.model.js";
import Expense from "../expense/expense.model.js";

/**
 * Get all expenseTypes
 */
export const getAllExpenseTypes = async (_: Request, res: Response) => {
  try {
    const expenseTypes = await ExpenseType.find().sort({ createdAt: -1 });

    res.json(expenseTypes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

/**
 * Create a new expenseType
 */
export const createExpenseType = async (req: Request, res: Response) => {
  try {
    const { title } = req.body;

    const newExpenseType = new ExpenseType({
      title,
    });

    await newExpenseType.save();

    res.status(201).json({
      message: "ExpenseType created successfully",
      data: newExpenseType,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "ExpenseType with this title already exists" });
    }
    res.status(500).json({ message: "Server error", error });
  }
};

/**
 * Update a single expenseType by its ID
 */
export const updateExpenseType = async (req: Request, res: Response) => {
  try {
    const { expenseTypeId } = req.params;

    const { title } = req.body;

    await ExpenseType.findByIdAndUpdate(expenseTypeId, {
      title,
    });

    res.json({ message: "ExpenseType updated successfully" });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "ExpenseType with this title already exists" });
    }
    res.status(500).json({ message: "Server error", error });
  }
};

/**
 *
 * @desc Delete a single expenseType by its ID
 */
export const deleteExpenseType = async (req: Request, res: Response) => {
  try {
    const { expenseTypeId } = req.params;

    // cannot delete if it is used in expense
    const inExpense = await Expense.findOne({ expenseType: expenseTypeId });
    if (inExpense) {
      return res
        .status(400)
        .json({ message: "ExpenseType is used in expenses" });
    }

    const deletedExpenseType = await ExpenseType.findByIdAndDelete(
      expenseTypeId
    );
    if (!deletedExpenseType) {
      return res.status(404).json({ message: "ExpenseType not found" });
    }

    res.status(200).json({ message: "ExpenseType deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};
