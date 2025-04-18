import { Body, Controller, Post } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { InvoiceDto } from './dto/invoice.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Invoices')
@Controller({ version: '1', path: 'invoices' })
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Post()
  async createInvoice(@Body() createInvoiceDto: InvoiceDto) {
    await this.invoiceService.create(createInvoiceDto);

    return { message: 'Invoice saved successfully' };
  }
}
