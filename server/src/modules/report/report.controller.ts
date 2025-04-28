import { Controller, Get, Query } from '@nestjs/common';
import { ReportService } from './report.service';
import { ApiTags } from '@nestjs/swagger';
import { GetAllReportsDto } from './dto/get-all-reports.dto';
import { GetReportsSumDto } from './dto/get-reports-sum.dto';
import { InvoiceService } from '../invoice/invoice.service';

@ApiTags('Reports')
@Controller({ version: '1', path: 'reports' })
export class ReportController {
  constructor(
    private readonly reportService: ReportService,
    private readonly invoicesService: InvoiceService,
  ) {}

  @Get('global')
  getGlobalAccounting() {
    return this.reportService.getGlobalAccounting();
  }

  @Get('all')
  getAllReports(@Query() dto: GetAllReportsDto) {
    return this.reportService.getAllReports(dto);
  }

  @Get('sum')
  getReportsSum(@Query() dto: GetReportsSumDto) {
    return this.reportService.getReportsSum(dto);
  }

  @Get('accounts-receivable-summary')
  getCustomersReports() {
    return this.invoicesService.getAccountsRecievableSummary();
  }
}
