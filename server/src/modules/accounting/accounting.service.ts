import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Accounting, IAccounting } from './accounting.schema';
import { Model } from 'mongoose';
import { UpdateUsdRateDto } from './dto/update-usd-rate.dto';

@Injectable()
export class AccountingService implements OnModuleInit {
  constructor(
    @InjectModel(Accounting.name)
    private accountingModel: Model<IAccounting>,
  ) {}

  onModuleInit() {
    this.populateAccounting();
  }

  async populateAccounting() {
    const accounting = await this.accountingModel.findOne();
    if (!accounting) {
      await this.accountingModel.create({ usdRate: 89000 });
      console.info('Accounting created successfully');
    } else {
      console.log('Accounting already exists');
    }
  }

  async getUsdRate() {
    const data = await this.accountingModel.findOne().select('usdRate');
    return { usdRate: data?.usdRate };
  }

  async updateUsdRate(dto: UpdateUsdRateDto) {
    const { usdRate } = dto;

    const accounting = await this.accountingModel.findOne();
    if (!accounting) throw new NotFoundException('Accounting not found');

    accounting.usdRate = usdRate;
    await accounting.save();
  }
}
