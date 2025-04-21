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
import { PurchaseService } from './purchase.service';
import { PurchaseDto } from './dto/purchase.dto';
import { ApiTags } from '@nestjs/swagger';
import { GetPurchaseDto } from './dto/get-purchase.dto';
import { Roles } from '../user/decorators/roles.decorator';
import { Permissions } from '../user/decorators/permissions.decorator';

@ApiTags('Purchase')
@Controller({ version: '1', path: 'purchase' })
export class PurchaseController {
  constructor(private readonly purchaseService: PurchaseService) {}

  @Permissions('Purchases', 'read')
  @Get()
  async getAll(@Query() dto: GetPurchaseDto) {
    return this.purchaseService.getAll(dto);
  }

  @Permissions('Purchases', 'create')
  @Post()
  async create(@Body() dto: PurchaseDto) {
    await this.purchaseService.create(dto);

    return { message: 'Purchase added successfully' };
  }

  @Permissions('Purchases', 'update')
  @Put(':id')
  async editPurchase(@Param('id') id: string, @Body() dto: PurchaseDto) {
    await this.purchaseService.edit(id, dto);

    return { message: 'Purchase updated successfully' };
  }

  @Roles('admin', 'superAmsAdmin')
  @Delete(':id')
  async deletePurchase(@Param('id') id: string) {
    await this.purchaseService.delete(id);

    return { message: 'Purchase deleted successfully' };
  }
}
