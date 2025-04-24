import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IReport, Report } from './report.schema';
import { FilterQuery, Model } from 'mongoose';
import { getFormattedDate } from 'src/utils/formatIsoDate';
import { AccountingService } from '../accounting/accounting.service';
import { GetAllReportsDto } from './dto/get-all-reports.dto';
import { GetReportsSumDto } from './dto/get-reports-sum.dto';

@Injectable()
export class ReportService {
  constructor(
    @InjectModel(Report.name)
    private reportModel: Model<IReport>,
    private readonly accountingService: AccountingService,
  ) {}

  async getGlobalAccounting() {
    const accountingDoc = await this.accountingService.getAccounting();

    return {
      totalIncome: accountingDoc.totalIncome,
      totalExpenses: accountingDoc.totalExpenses,
      totalCustomersLoan: accountingDoc.totalCustomersLoan,
      totalSuppliersLoan: accountingDoc.totalSuppliersLoan,
    };
  }

  async getReportsSum(dto: GetReportsSumDto) {
    const { startDate, endDate } = dto;

    const result = await this.reportModel.aggregate([
      {
        $match: {
          date: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $group: {
          _id: null,
          totalIncome: { $sum: '$totalIncome' },
          totalExpenses: { $sum: '$totalExpenses' },
        },
      },
      {
        $project: {
          _id: 0,
          totalIncome: 1,
          totalExpenses: 1,
        },
      },
    ]);

    return result[0] || { totalIncome: 0, totalExpenses: 0 };
  }

  async getAllReports(dto: GetAllReportsDto) {
    const { pageIndex, startDate, endDate, pageSize } = dto;

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
      delete filters.$and;
    }

    const [reports, totalCount] = await Promise.all([
      this.reportModel
        .find(filters)
        .sort({ createdAt: -1 })
        .skip((Number(pageIndex) || 0) * pageSize)
        .limit(pageSize),
      this.reportModel.countDocuments(filters),
    ]);

    const totalPages = Math.ceil(totalCount / pageSize);

    return {
      reports,
      pagination: {
        pageIndex,
        pageSize,
        totalCount,
        totalPages,
      },
    };
  }

  async syncDailyReport({
    date,
    totalIncome,
    totalExpenses,
  }: {
    date: string | Date;
    totalIncome?: number;
    totalExpenses?: number;
  }) {
    const formattedDate = getFormattedDate(date);
    return await this.reportModel.updateOne(
      { date: formattedDate },
      {
        $set: { date: formattedDate },
        $inc: {
          totalIncome: totalIncome || 0,
          totalExpenses: totalExpenses || 0,
        },
      },
      {
        upsert: true,
      },
    );
  }
}
