import { Request, Response } from "express";
import Report, { IReport } from "./report.model.js";
import { FilterQuery } from "mongoose";

/**
 * Get Reports in date range for the chart + calc totalIncome & totalExpenses
 */
export const getChartReports = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ message: "Missing startDate or endDate" });
    }

    const reports = await Report.find({
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    });

    // calc totalIncome & totalExpenses
    const totalIncomeUsd = reports.reduce(
      (acc, report) => acc + report.totalIncome,
      0
    );
    const totalExpensesUsd = reports.reduce(
      (acc, report) => acc + report.totalExpenses,
      0
    );

    res.json({
      reports,
      totalIncomeUsd: totalIncomeUsd || 0,
      totalExpensesUsd: totalExpensesUsd || 0,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

/**
 * Get Reports
 */
export const getReports = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, pageIndex } = req.query;

    const pageSize = 20;
    const filters: FilterQuery<IReport> = { $and: [{ $or: [] }] };

    // Add date range filter
    if (startDate || endDate) {
      const dateFilter: any = {};
      if (startDate) {
        dateFilter.$gte = new Date(startDate as string);
      }
      if (endDate) {
        const nextDay = new Date(endDate as string);
        nextDay.setDate(nextDay.getDate() + 1);
        dateFilter.$lt = nextDay;
      }
      // @ts-ignore
      filters.$and.push({ createdAt: dateFilter });
    }

    // If no filters were added to $or, remove it
    if (filters?.$and?.[0]?.$or?.length === 0) {
      filters.$and = filters.$and.slice(1);
    }

    // If no filters were added at all, use an empty filter to query all orders
    if (filters?.$and?.length === 0) {
      // @ts-ignore
      delete filters.$and;
    }

    const [reports, totalCount] = await Promise.all([
      Report.find(filters)
        .sort({ createdAt: -1 })
        .skip((Number(pageIndex) || 0) * pageSize)
        .limit(pageSize),
      Report.countDocuments(filters),
    ]);

    const totalPages = Math.ceil(totalCount / pageSize);

    res.json({ reports, pageIndex, pageSize, totalCount, totalPages });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
