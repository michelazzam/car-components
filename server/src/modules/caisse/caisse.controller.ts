import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CaisseService } from './caisse.service';
import { ApiTags } from '@nestjs/swagger';
import { CloseOpenCaisseDto } from './dto/close-open-caisse.dto';
import { GetCaisseHistoryDto } from './dto/get-caisse-history.dto';

@ApiTags('Caisse')
@Controller({ version: '1', path: 'caisse' })
export class CaisseController {
  constructor(private readonly caisseService: CaisseService) {}

  @Get()
  async getCaisseStatus() {
    return await this.caisseService.getCaisseStatus();
  }

  @Get('history')
  getAllReports(@Query() dto: GetCaisseHistoryDto) {
    return this.caisseService.getCaisseHistory(dto);
  }

  @Post('open-caisse')
  async openCaisse(@Body() dto: CloseOpenCaisseDto) {
    await this.caisseService.openCaisse(dto);

    return { message: 'Caisse opened successfully' };
  }

  @Post('close-caisse')
  async closeCaisse(@Body() dto: CloseOpenCaisseDto) {
    await this.caisseService.closeCaisse(dto);

    return { message: 'Caisse closed successfully' };
  }
}
