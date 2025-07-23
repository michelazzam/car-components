import {
  BadRequestException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Accounting, IAccounting } from './accounting.schema';
import { Model } from 'mongoose';
import { UpdateUsdRateDto } from './dto/update-usd-rate.dto';
import { SupplierService } from '../supplier/supplier.service';

@Injectable()
export class AccountingService implements OnModuleInit {
  constructor(
    @InjectModel(Accounting.name)
    private accountingModel: Model<IAccounting>,
    private supplierService: SupplierService,
  ) {}

  async onModuleInit() {
    await this.populateAccounting();
  }

  async populateAccounting() {
    const accounting = await this.accountingModel.findOne();
    if (!accounting) {
      await this.accountingModel.create({ usdRate: 89000 });
      console.info('Accounting created successfully');
    } else {
      console.log('Accounting already exists');
    }

    // Calculate total supplier loans by getting all suppliers and summing their loans
    //Todo - remove this after the migration is done 23-7-2025
    const { suppliers } = await this.supplierService.getAll({
      pageIndex: 0,
      pageSize: 1000000, // Large number to get all suppliers
      onlyHasLoan: 'true', // Only get suppliers with loans
    });

    const totalSuppliersLoan = suppliers.reduce(
      (total, supplier) => total + supplier.loan,
      0,
    );

    // Update the accounting record with the calculated total
    await this.accountingModel.findOneAndUpdate(
      {},
      { $set: { totalSuppliersLoan } },
      { new: true },
    );

    console.info(
      `Total supplier loans calculated and updated: ${totalSuppliersLoan}`,
    );
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

  async getAccounting() {
    const accounting = await this.accountingModel.findOne();
    if (!accounting) throw new NotFoundException('Accounting not found');

    return accounting;
  }

  async updateAccounting(fields: Partial<IAccounting>) {
    const accounting = await this.getAccounting();
    if (!accounting) throw new NotFoundException('Accounting not found');

    await this.accountingModel.findByIdAndUpdate(accounting._id, {
      $set: fields,
    });
  }

  /**
   * Updates the accounting document by incrementing specified numeric fields.
   *
   * @param data - An object where each key is a field of IAccounting and the value is a number to increment.
   *
   * @throws NotFoundException if the accounting document does not exist.
   * @throws BadRequestException if no valid numeric fields are provided for update.
   *
   * @example
   * await updateAccounting({ totalIncome: 100, totalExpenses: -50 });
   */
  async incAccountingNumberFields(
    data: Partial<Record<keyof IAccounting, number>>,
  ) {
    const accounting = await this.getAccounting();

    const incFields: Record<string, number> = {};

    for (const [key, value] of Object.entries(data)) {
      if (typeof value === 'number') {
        incFields[key] = value;
      }
    }

    if (Object.keys(incFields).length === 0) {
      throw new BadRequestException('No valid numeric fields to update');
    }

    await this.accountingModel.findByIdAndUpdate(accounting._id, {
      $inc: incFields,
    });
  }
}
