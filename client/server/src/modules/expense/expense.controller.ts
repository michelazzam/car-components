import { Request, Response } from "express";
import Expense, { IExpense } from "./expense.model.js";
import Accounting, { accountingId } from "../accounting/accounting.model.js";
import { FilterQuery } from "mongoose";
import Report from "../report/report.model.js";
import { formatISODate } from "../../utils/formatIsoDate.js";

/**
 * Get all expenses
 */
export const getAllExpenses = async (req: Request, res: Response) => {
  try {
    const { search, pageIndex, expenseTypeId, startDate, endDate, pageSize} = req.query;

    const filter: FilterQuery<IExpense> = { $and: [{ $or: [] }] };

    if (search) {
      // @ts-ignore
      filter.$and[0].$or.push({
        note: { $regex: search, $options: "i" },
      });
    }

    if (expenseTypeId) {
      // @ts-ignore
      filter.$and[0].$or.push({ expenseType: expenseTypeId });
    }

    // Add date range filter
    if (startDate || endDate) {
      const dateFilter: any = {};
      if (startDate) {
        dateFilter.$gte = startDate;
      }
      if (endDate) {
        const nextDay = new Date(endDate as string);
        nextDay.setDate(nextDay.getDate() + 1);
        dateFilter.$lt = formatISODate(nextDay);
      }
      // @ts-ignore
      filter.$and.push({ date: dateFilter });
    }

    // If no filters were added to $or, remove it
    if (filter?.$and?.[0]?.$or?.length === 0) {
      filter.$and = filter.$and.slice(1);
    }

    // If no filters were added at all, use an empty filter to query all orders
    if (filter?.$and?.length === 0) {
      // @ts-ignore
      delete filter.$and;
    }

    const [expenses, totalCount] = await Promise.all([
      Expense.find(filter)
        .sort({ date: -1 })
        .populate("expenseType")
        .skip((Number(pageIndex) || 0) * Number(pageSize))
        .limit(Number(pageSize)),
      Expense.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalCount / Number(pageSize));

    res.json({ expenses, pageIndex, pageSize, totalCount, totalPages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

/**
 * Create a new expense
 */
export const createExpense = async (req: Request, res: Response) => {
  try {
    const { expenseTypeId, amount, date, note } = req.body;

    const formattedDate = formatISODate(date);

    // save expense
    const newExpenseType = new Expense({
      expenseType: expenseTypeId,
      amount,
      date: formattedDate,
      note,
    });
    await newExpenseType.save();

    await syncExpenseAccountingChanges(amount, formattedDate);

    res.status(201).json({
      message: "Expense saved successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

/**
 * Update a single expense by its ID
 */
export const updateExpense = async (req: Request, res: Response) => {
  try {
    const { expenseId } = req.params;

    const { expenseTypeId, amount, date, note } = req.body;

    await revertExpenseAccountingChanges(expenseId);

    const formattedDate = formatISODate(date);

    // update expense
    await Expense.findByIdAndUpdate(expenseId, {
      expenseType: expenseTypeId,
      amount,
      date: formattedDate,
      note,
    });

    await syncExpenseAccountingChanges(amount, formattedDate);

    res.json({ message: "Expense updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

/**
 *
 * @desc Delete a single expense by its ID
 */
export const deleteExpense = async (req: Request, res: Response) => {
  try {
    const { expenseId } = req.params;

    await revertExpenseAccountingChanges(expenseId);

    // delete expense
    const deletedExpenseType = await Expense.findByIdAndDelete(expenseId);
    if (!deletedExpenseType) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

async function syncExpenseAccountingChanges(amount: number, date: string) {
  // increase total expense amount
  await Accounting.findByIdAndUpdate(accountingId, {
    $inc: { totalExpenses: amount },
  });

  // increase date expense in report
  await Report.findOneAndUpdate(
    { date: date },
    { $inc: { totalExpenses: amount } },
    { new: true, upsert: true }
  );
}

async function revertExpenseAccountingChanges(expenseId: string) {
  const expense = await Expense.findById(expenseId);
  if (!expense) {
    throw new Error("Expense not found");
  }

  // decrease total expense amount
  await Accounting.findByIdAndUpdate(accountingId, {
    $inc: { totalExpenses: expense.amount * -1 },
  });

  // decrease date expense in report
  await Report.findOneAndUpdate(
    { date: expense.date },
    { $inc: { totalExpenses: expense.amount * -1 } },
    { new: true, upsert: true }
  );
}
