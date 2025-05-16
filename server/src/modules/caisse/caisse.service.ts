import { BadRequestException, Injectable } from '@nestjs/common';
import { CloseOpenCaisseDto } from './dto/close-open-caisse.dto';
import { AccountingService } from '../accounting/accounting.service';

@Injectable()
export class CaisseService {
  constructor(private accountingService: AccountingService) {}

  async openCaisse(dto: CloseOpenCaisseDto) {
    const { amount } = dto;

    const accounting = await this.accountingService.getAccounting();
    if (accounting.isCaisseOpen)
      throw new BadRequestException('Caisse is already open');

    await this.accountingService.updateAccounting({
      caisse: amount,
      isCaisseOpen: true,
    });
  }

  async closeCaisse(dto: CloseOpenCaisseDto) {
    const { amount } = dto;

    const accounting = await this.accountingService.getAccounting();
    if (!accounting.isCaisseOpen)
      throw new BadRequestException('Caisse is already closed');

    await this.accountingService.updateAccounting({
      caisse: amount,
      isCaisseOpen: false,
    });
  }

  async getCaisseStatus() {
    const accounting = await this.accountingService.getAccounting();

    return {
      caisse: accounting.caisse,
      isCaisseOpen: accounting.isCaisseOpen,
    };
  }
}
