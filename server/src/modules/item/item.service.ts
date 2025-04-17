import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IItem, Item } from './item.schema';
import { Model } from 'mongoose';
import { AddItemDto } from './dto/add-item.dto';
import { EditItemDto } from './dto/edit-item.dto';

@Injectable()
export class ItemService {
  constructor(
    @InjectModel(Item.name)
    private itemModel: Model<IItem>,
  ) {}

  async getAll() {
    return this.itemModel.find().sort({ createdAt: -1 });
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
