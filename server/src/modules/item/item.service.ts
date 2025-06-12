import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
    const {
      pageIndex,
      search,
      pageSize,
      paginationType = 'paged',
      nextCursor: cursor = null,
    } = dto;

    const filter: FilterQuery<IItem> = {};

    // Add search filter
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { note: { $regex: search, $options: 'i' } },
        { locationInStore: { $regex: search, $options: 'i' } },
      ];
    }

    let items;
    let nextCursor;

    if (paginationType === 'paged') {
      const [pagedItems, totalCount, totalsResult] = await Promise.all([
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
      items = pagedItems;

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
    } else {
      // Cursor-based pagination
      const cursorFilter = cursor ? { _id: { $lt: cursor } } : {};

      if (cursor) {
        filter._id = { $lt: cursor };
      }
      const [cursorItems, totalsResult] = await Promise.all([
        this.itemModel
          .find({ ...filter, ...cursorFilter })
          .sort({ createdAt: -1 })
          .limit(pageSize + 1)
          .populate('supplier', 'name')
          .lean(),
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

      if (cursorItems.length > pageSize) {
        nextCursor = cursorItems[pageSize - 1]._id;
        cursorItems.pop(); // Remove the extra item used for calculating the nextCursor
      }

      const totals = totalsResult[0] || {
        totalCost: 0,
        totalPrice: 0,
        totalProfitOrLoss: 0,
      };

      const itemsWithCalculations = cursorItems.map((item) => {
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
        nextCursor: nextCursor || null,
      };
    }
  }

  getOneById(id: string) {
    return this.itemModel.findById(id);
  }

  getManyByIds(ids: string[]) {
    return this.itemModel.find({ _id: { $in: ids } }).lean();
  }

  async create(dto: AddItemDto) {
    const existingItem = await this.itemModel.findOne({
      name: dto.name,
    });
    if (existingItem) {
      throw new BadRequestException('Item with this name already exists');
    }

    await this.itemModel.create({
      supplier: dto.supplierId,
      note: dto.note,
      locationInStore: dto.locationInStore,
      cost: formatMoneyField(dto.cost),
      price: formatMoneyField(dto.price),
      quantity: dto.quantity,
      name: dto.name,
      status: dto.status,
    });
  }

  async edit(id: string, dto: EditItemDto) {
    const item = await this.itemModel.findById(id);
    if (!item) throw new NotFoundException(`Item with id ${id} not found`);

    if (item.name !== dto.name) {
      const existingItem = await this.itemModel.findOne({
        name: dto.name,
        _id: { $ne: id },
      });
      if (existingItem) {
        throw new BadRequestException('Item with this name already exists');
      }
    }

    await this.itemModel.findByIdAndUpdate(id, {
      supplier: dto.supplierId,
      cost: formatMoneyField(dto.cost),
      note: dto.note,
      locationInStore: dto.locationInStore,
      price: formatMoneyField(dto.price),
      quantity: dto.quantity,
      name: dto.name,
      status: dto.status,
    });
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
