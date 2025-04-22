import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IReport, Report } from './report.schema';
import { Model } from 'mongoose';
import { getFormattedDate } from 'src/utils/formatIsoDate';

@Injectable()
export class ReportService {
  constructor(
    @InjectModel(Report.name)
    private reportModel: Model<IReport>,
  ) {}

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
          totalIncome,
          totalExpenses,
        },
      },
      {
        upsert: true,
      },
    );
  }
}
