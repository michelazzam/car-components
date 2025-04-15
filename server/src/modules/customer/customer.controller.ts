import {
  Get,
  Post,
  Body,
  Put,
  Delete,
  Param,
  Controller,
  Query,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import { ApiTags } from '@nestjs/swagger';
import { CustomerDto } from './dto/customer.dto';
import { EditCustomerDto } from './dto/edit-customer.dto';
import { GetCustomersDto } from './dto/get-customers.dto';

@ApiTags('Customer')
@Controller({ version: '1', path: 'customers' })
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get()
  async getAll(@Query() dto: GetCustomersDto) {
    return await this.customerService.getAll(dto);
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    return await this.customerService.getOne(id);
  }

  @Post()
  async create(@Body() createCustomerDto: CustomerDto) {
    return await this.customerService.create(createCustomerDto);
  }

  @Put(':id')
  async editCustomer(
    @Param('id') id: string,
    @Body() editCustomerDto: EditCustomerDto,
  ) {
    return await this.customerService.editCustomer(id, editCustomerDto);
  }

  @Delete(':id')
  async deleteCustomer(@Param('id') id: string) {
    return await this.customerService.deleteCustomer(id);
  }
}
