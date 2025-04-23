import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IItem, Item } from './item.schema';
import { FilterQuery, Model } from 'mongoose';
import { AddItemDto } from './dto/add-item.dto';
import { EditItemDto } from './dto/edit-item.dto';
import { GetItemsDto } from './dto/get-items.dto';

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
      filter.$or = [{ name: { $regex: search, $options: 'i' } }];
    }

    const [items, totalCount] = await Promise.all([
      this.itemModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(pageIndex * pageSize)
        .limit(pageSize)
        .populate('supplier', 'name'),
      this.itemModel.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalCount / pageSize);

    return {
      items,
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
      cost: dto.cost,
      price: dto.price,
      quantity: dto.quantity,
      name: dto.name,
      status: dto.status,
    });
  }

  async edit(id: string, dto: EditItemDto) {
    const item = await this.itemModel.findByIdAndUpdate(id, {
      supplier: dto.supplierId,
      cost: dto.cost,
      price: dto.price,
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
