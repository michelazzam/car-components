import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Expense, IExpense } from './expense.schema';
import { FilterQuery, Model } from 'mongoose';
import { ExpenseDto } from './dto/expense.dto';
import { GetExpensesDto } from './dto/get-expenses.dto';
import { getFormattedDate } from 'src/utils/formatIsoDate';
import { AccountingService } from '../accounting/accounting.service';
import { ReportService } from '../report/report.service';
import { SupplierService } from '../supplier/supplier.service';

@Injectable()
export class ExpenseService {
  constructor(
    @InjectModel(Expense.name)
    private expenseModel: Model<IExpense>,
    private readonly supplierervice: SupplierService,
    private readonly accountingService: AccountingService,
    private readonly reportService: ReportService,
  ) {}

  async getAll(dto: GetExpensesDto) {
    const {
      pageIndex,
      search,
      pageSize,
      expenseTypeId,
      startDate,
      endDate,
      supplierId,
    } = dto;

    const filter: FilterQuery<IExpense> = { $and: [{ $or: [] }] };

    if (search) {
      // @ts-ignore
      filter.$and[0].$or.push({
        note: { $regex: search, $options: 'i' },
      });
    }

    if (expenseTypeId) {
      // @ts-ignore
      filter.$and[0].$or.push({ expenseType: expenseTypeId });
    }

    if (supplierId) {
      // @ts-ignore
      filter.$and[0].$or.push({ supplier: supplierId });
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
        dateFilter.$lt = getFormattedDate(nextDay);
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
      this.expenseModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(pageIndex * pageSize)
        .limit(pageSize)
        .populate('expenseType'),
      this.expenseModel.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalCount / pageSize);

    return {
      expenses,
      pagination: {
        pageIndex,
        pageSize,
        totalCount,
        totalPages,
      },
    };
  }

  async create(dto: ExpenseDto) {
    await this.expenseModel.create({
      expenseType: dto.expenseTypeId,
      supplier: dto.supplierId,
      amount: dto.amount,
      date: dto.date,
      note: dto.note,
    });

    await this.doExpenseEffects(dto);
  }

  async edit(id: string, dto: ExpenseDto) {
    await this.revertExpenseEffects(id);

    const expense = await this.expenseModel.findOneAndUpdate(
      { _id: id },
      {
        expenseType: dto.expenseTypeId,
        supplier: dto.supplierId,
        amount: dto.amount,
        date: dto.date,
        note: dto.note,
      },
    );
    if (!expense) throw new NotFoundException('Expense not found');

    await this.doExpenseEffects(dto);

    return expense;
  }

  async delete(id: string) {
    await this.revertExpenseEffects(id);

    const expense = await this.expenseModel.findOneAndDelete({ _id: id });

    if (!expense) throw new NotFoundException('Expense not found');
    return expense;
  }

  private async doExpenseEffects(dto: ExpenseDto) {
    // subtract supplier loan
    if (dto.supplierId) {
      const supplier = await this.supplierervice.getOneById(dto.supplierId);
      if (!supplier) throw new NotFoundException('Supplier not found');

      supplier.loan -= dto.amount;
      await supplier.save();
    }

    // update daily report
    await this.reportService.syncDailyReport({
      date: dto.date,
      totalExpenses: dto.amount,
      totalIncome: 0,
    });

    // update accounting
    await this.accountingService.updateAccounting({
      totalExpenses: dto.amount, //increase total expenses
      totalSuppliersLoan: -dto.amount, //decrease total suppliers loan
    });
  }

  private async revertExpenseEffects(expenseId: string) {
    const expense = await this.expenseModel.findById(expenseId).lean();
    if (!expense) {
      throw new BadRequestException('Expense not found');
    }

    // Increase supplier loan
    const supplier = await this.supplierervice.getOneById(
      expense.supplier?.toString(),
    );
    if (!supplier) {
      return; //ignore deleted suppliers
    }

    supplier.loan += expense.amount;
    await supplier.save();

    // update daily report
    await this.reportService.syncDailyReport({
      date: expense.date,
      totalExpenses: expense.amount,
    });

    // update accounting
    await this.accountingService.updateAccounting({
      totalExpenses: -expense.amount, // decrease total expenses
      totalSuppliersLoan: expense.amount, // re-add total suppliers loan
    });
  }
}
