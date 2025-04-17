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
        .limit(pageSize),
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

  async create(dto: AddItemDto) {
    await this.itemModel.create(dto);
  }

  async edit(id: string, dto: EditItemDto) {
    const item = await this.itemModel.findByIdAndUpdate(id, dto);

    if (!item) throw new NotFoundException(`Item with id ${id} not found`);
    return item;
  }

  async delete(id: string) {
    const item = await this.itemModel.findByIdAndDelete(id);

    if (!item) throw new NotFoundException(`Item with id ${id} not found`);
    return item;
  }
}
