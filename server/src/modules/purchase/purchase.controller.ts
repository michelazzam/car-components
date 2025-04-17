import { Controller } from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { AddPurchaseDto } from './dto/add-purchase.dto';

@Controller('purchase')
export class PurchaseController {
  constructor(private readonly purchaseService: PurchaseService) {}
}
