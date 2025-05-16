import { BadRequestException, Injectable } from '@nestjs/common';
import { CloseOpenCaisseDto } from './dto/close-open-caisse.dto';
import { AccountingService } from '../accounting/accounting.service';
import { GetCaisseHistoryDto } from './dto/get-caisse-history.dto';
import { FilterQuery, Model } from 'mongoose';
import { CaisseHistory, ICaisseHistory } from './caisse.schema';
import { getFormattedDate } from 'src/utils/getFormattedDate';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class CaisseService {
  constructor(
    private accountingService: AccountingService,
    @InjectModel(CaisseHistory.name)
    private caisseHistoryModel: Model<ICaisseHistory>,
  ) {}

  async openCaisse(dto: CloseOpenCaisseDto) {
    const { amount } = dto;

    const accounting = await this.accountingService.getAccounting();
    if (accounting.isCaisseOpen)
      throw new BadRequestException('Caisse is already open');

    await this.accountingService.updateAccounting({
      caisse: amount,
      isCaisseOpen: true,
    });
  }

  async closeCaisse(dto: CloseOpenCaisseDto) {
    const { amount } = dto;

    const accounting = await this.accountingService.getAccounting();
    if (!accounting.isCaisseOpen)
      throw new BadRequestException('Caisse is already closed');

    await this.accountingService.updateAccounting({
      caisse: amount,
      isCaisseOpen: false,
    });
  }

  async getCaisseStatus() {
    const accounting = await this.accountingService.getAccounting();

    return {
      caisse: accounting.caisse,
      isCaisseOpen: accounting.isCaisseOpen,
    };
  }

  async getCaisseHistory(dto: GetCaisseHistoryDto) {
    const { pageIndex, startDate, endDate, pageSize } = dto;

    const filters: FilterQuery<ICaisseHistory> = { $and: [{ $or: [] }] };

    // Add date range filter
    if (startDate || endDate) {
      const dateFilter: any = {};
      if (startDate) {
        dateFilter.$gte = startDate;
      }
      if (endDate) {
        const nextDay = new Date(endDate as string);
        nextDay.setDate(nextDay.getDate() + 1);
        dateFilter.$lt = getFormattedDate(nextDay);
      }
      // @ts-ignore
      filter.$and.push({ date: dateFilter });
    }

    // If no filters were added to $or, remove it
    if (filters?.$and?.[0]?.$or?.length === 0) {
      filters.$and = filters.$and.slice(1);
    }

    // If no filters were added at all, use an empty filter to query all orders
    if (filters?.$and?.length === 0) {
      delete filters.$and;
    }

    const [caisseHistory, totalCount] = await Promise.all([
      this.caisseHistoryModel
        .find(filters)
        .sort({ date: -1 })
        .skip((Number(pageIndex) || 0) * pageSize)
        .limit(pageSize),
      this.caisseHistoryModel.countDocuments(filters),
    ]);

    const totalPages = Math.ceil(totalCount / pageSize);

    return {
      caisseHistory,
      pagination: {
        pageIndex,
        pageSize,
        totalCount,
        totalPages,
      },
    };
  }
}
