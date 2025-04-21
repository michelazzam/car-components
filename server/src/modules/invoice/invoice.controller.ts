import { Body, Controller, Get, Post, Put, Query } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { InvoiceDto } from './dto/invoice.dto';
import { ApiTags } from '@nestjs/swagger';
import { GetInvoicesDto } from './dto/get-invoices.dto';
import { Permissions } from '../user/decorators/permissions.decorator';
import { User } from '../user/decorators/user.decorator';
import { ReqUserData } from '../user/interfaces/req-user-data.interface';
import { PayCustomerInvoicesDto } from './dto/pay-customer-invoices.dto';

@ApiTags('Invoices')
@Controller({ version: '1', path: 'invoices' })
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Permissions('Invoices', 'read')
  @Get()
  async getAll(@Query() dto: GetInvoicesDto, @User() user: ReqUserData) {
    return this.invoiceService.getAll(dto, user);
  }

  @Permissions('Invoices', 'create')
  @Post()
  async createInvoice(@Body() createInvoiceDto: InvoiceDto) {
    await this.invoiceService.create(createInvoiceDto);

    return { message: 'Invoice saved successfully' };
  }

  @Permissions('Invoices', 'update')
  @Put('pay-customer-invoices')
  async payCustomerInvoices(@Body() dto: PayCustomerInvoicesDto) {
    await this.invoiceService.payCustomerInvoices(dto);

    return { message: 'Invoices paid successfully' };
  }
}
