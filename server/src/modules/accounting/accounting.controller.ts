import { Body, Controller, Get, Put } from '@nestjs/common';
import { AccountingService } from './accounting.service';
import { ApiTags } from '@nestjs/swagger';
import { UpdateUsdRateDto } from './dto/update-usd-rate.dto';
import { Permissions } from '../user/decorators/permissions.decorator';

@ApiTags('Accounting')
@Controller({ version: '1', path: 'accounting' })
export class AccountingController {
  constructor(private readonly accountingService: AccountingService) {}

  @Get('usd-rate')
  async getAccounting() {
    return await this.accountingService.getUsdRate();
  }

  @Permissions('Accounting', 'update')
  @Put('usd-rate')
  async updateUsdRate(@Body() dto: UpdateUsdRateDto) {
    await this.accountingService.updateUsdRate(dto);

    return { message: 'USD Rate updated successfully' };
  }
}
