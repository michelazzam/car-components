import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ItemService } from './item.service';
import { ApiTags } from '@nestjs/swagger';
import { AddItemDto } from './dto/add-item.dto';
import { EditItemDto } from './dto/edit-item.dto';
import { GetItemsDto } from './dto/get-items.dto';
import { Roles } from '../user/decorators/roles.decorator';
import { Permissions } from '../user/decorators/permissions.decorator';

@ApiTags('Item')
@Controller({ version: '1', path: 'items' })
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Permissions('Inventory', 'read')
  @Get()
  async getAll(@Query() dto: GetItemsDto) {
    return this.itemService.getAll(dto);
  }

  @Permissions('Inventory', 'read')
  @Get(':id')
  async getSingleItem(@Param('id') id: string) {
    return this.itemService.getOneById(id);
  }

  @Permissions('Inventory', 'create')
  @Post()
  async create(@Body() dto: AddItemDto) {
    await this.itemService.create(dto);

    return { message: 'Item added successfully' };
  }

  @Permissions('Inventory', 'update')
  @Put(':id')
  async edit(@Param('id') id: string, @Body() dto: EditItemDto) {
    await this.itemService.edit(id, dto);

    return { message: 'Item updated successfully' };
  }

  @Roles('admin', 'superAmsAdmin')
  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.itemService.delete(id);

    return { message: 'Item deleted successfully' };
  }
}
