import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ItemService } from './item.service';
import { ApiTags } from '@nestjs/swagger';
import { AddItemDto } from './dto/add-item.dto';
import { EditItemDto } from './dto/edit-item.dto';

@ApiTags('Item')
@Controller({ version: '1', path: 'items' })
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Get()
  async getAll() {
    return this.itemService.getAll();
  }

  @Post()
  async create(@Body() dto: AddItemDto) {
    await this.itemService.create(dto);

    return { message: 'Item added successfully' };
  }

  @Put(':id')
  async edit(@Param('id') id: string, @Body() dto: EditItemDto) {
    await this.itemService.edit(id, dto);

    return { message: 'Item updated successfully' };
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.itemService.delete(id);

    return { message: 'Item deleted successfully' };
  }
}
