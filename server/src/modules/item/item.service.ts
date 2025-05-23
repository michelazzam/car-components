import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IItem, Item } from './item.schema';
import { FilterQuery, Model } from 'mongoose';
import { AddItemDto } from './dto/add-item.dto';
import { EditItemDto } from './dto/edit-item.dto';
import { GetItemsDto } from './dto/get-items.dto';
import { formatMoneyField } from 'src/utils/formatMoneyField';

@Injectable()
export class ItemService {
  constructor(
    @InjectModel(Item.name)
    private itemModel: Model<IItem>,
  ) {}

  async getAll(dto: GetItemsDto) {
    const { pageIndex, search, pageSize } = dto;

    const filter: FilterQuery<IItem> = {};

    // Add search filter
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { note: { $regex: search, $options: 'i' } },
      ];
    }

    const [items, totalCount, totalsResult] = await Promise.all([
      this.itemModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(pageIndex * pageSize)
        .limit(pageSize)
        .populate('supplier', 'name')
        .lean(),
      this.itemModel.countDocuments(filter),
      this.itemModel.aggregate([
        { $match: filter },
        {
          $group: {
            _id: null,
            totalCost: { $sum: { $multiply: ['$cost', '$quantity'] } },
            totalPrice: { $sum: { $multiply: ['$price', '$quantity'] } },
            totalProfitOrLoss: {
              $sum: {
                $subtract: [
                  { $multiply: ['$price', '$quantity'] },
                  { $multiply: ['$cost', '$quantity'] },
                ],
              },
            },
          },
        },
      ]),
    ]);

    const totalPages = Math.ceil(totalCount / pageSize);

    const totals = totalsResult[0] || {
      totalCost: 0,
      totalPrice: 0,
      totalProfitOrLoss: 0,
    };

    const itemsWithCalculations = items.map((item) => {
      const totalCost = item.cost * item.quantity;
      const totalPrice = item.price * item.quantity;
      const profitOrLoss = totalPrice - totalCost;

      return {
        ...item,
        totalCost,
        totalPrice,
        profitOrLoss,
      };
    });

    return {
      items: itemsWithCalculations,
      totals,
      pagination: {
        pageIndex,
        pageSize,
        totalCount,
        totalPages,
      },
    };
  }

  getOneById(id: string) {
    return this.itemModel.findById(id);
  }

  getManyByIds(ids: string[]) {
    return this.itemModel.find({ _id: { $in: ids } }).lean();
  }

  async create(dto: AddItemDto) {
    await this.itemModel.create({
      supplier: dto.supplierId,
      note: dto.note,
      cost: formatMoneyField(dto.cost),
      price: formatMoneyField(dto.price),
      lowPrice: formatMoneyField(dto.lowPrice),
      mediumPrice: formatMoneyField(dto.mediumPrice),
      quantity: dto.quantity,
      name: dto.name,
      status: dto.status,
    });
  }

  async edit(id: string, dto: EditItemDto) {
    const item = await this.itemModel.findByIdAndUpdate(id, {
      supplier: dto.supplierId,
      cost: formatMoneyField(dto.cost),
      note: dto.note,
      price: formatMoneyField(dto.price),
      lowPrice: formatMoneyField(dto.lowPrice),
      mediumPrice: formatMoneyField(dto.mediumPrice),
      quantity: dto.quantity,
      name: dto.name,
      status: dto.status,
    });

    if (!item) throw new NotFoundException(`Item with id ${id} not found`);
    return item;
  }

  updateItemQuantity(id: string, quantity: number) {
    return this.itemModel.findByIdAndUpdate(id, {
      $inc: { quantity },
    });
  }

  async delete(id: string) {
    const item = await this.itemModel.findByIdAndDelete(id);

    if (!item) throw new NotFoundException(`Item with id ${id} not found`);
    return item;
  }
}
