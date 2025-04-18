import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { AddPurchaseDto } from './dto/add-purchase.dto';
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
  async create(@Body() dto: AddPurchaseDto) {
    await this.purchaseService.create(dto);

    return { message: 'Purchase added successfully' };
  }
}
