import { Body, Controller, Post } from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { AddPurchaseDto } from './dto/add-purchase.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Purchase')
@Controller({ version: '1', path: 'purchase' })
export class PurchaseController {
  constructor(private readonly purchaseService: PurchaseService) {}

  @Post()
  async create(@Body() dto: AddPurchaseDto) {
    await this.purchaseService.create(dto);

    return { message: 'Purchase added successfully' };
  }
}
