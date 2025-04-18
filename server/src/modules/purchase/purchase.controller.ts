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

@ApiTags('Purchase')
@Controller({ version: '1', path: 'purchase' })
export class PurchaseController {
  constructor(private readonly purchaseService: PurchaseService) {}

  @Get()
  async getAll(@Query() dto: GetPurchaseDto) {
    return this.purchaseService.getAll(dto);
  }

  @Post()
  async create(@Body() dto: PurchaseDto) {
    await this.purchaseService.create(dto);

    return { message: 'Purchase added successfully' };
  }

  @Put(':id')
  async editPurchase(@Param('id') id: string, @Body() dto: PurchaseDto) {
    await this.purchaseService.edit(id, dto);

    return { message: 'Purchase updated successfully' };
  }

  @Delete(':id')
  async deletePurchase(@Param('id') id: string) {
    await this.purchaseService.delete(id);

    return { message: 'Purchase deleted successfully' };
  }
}
