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
import { SupplierService } from './supplier.service';
import { ApiTags } from '@nestjs/swagger';
import { GetSuppliersDto } from './dto/get-suppliers.dto';
import { AddSupplierDto } from './dto/add-supplier.dto';
import { EditSupplierDto } from './dto/edit-supplier.dto';

@ApiTags('Supplier')
@Controller({ version: '1', path: 'suppliers' })
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  @Get()
  async getAll(@Query() dto: GetSuppliersDto) {
    return this.supplierService.getAll(dto);
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.supplierService.getOne(id);
  }

  @Post()
  async create(@Body() createCustomerDto: AddSupplierDto) {
    await this.supplierService.create(createCustomerDto);

    return { message: 'Supplier added successfully' };
  }

  @Put(':id')
  async editCustomer(
    @Param('id') id: string,
    @Body() editCustomerDto: EditSupplierDto,
  ) {
    await this.supplierService.editSupplier(id, editCustomerDto);

    return { message: 'Supplier updated successfully' };
  }

  @Delete(':id')
  async deleteCustomer(@Param('id') id: string) {
    await this.supplierService.deleteSupplier(id);

    return { message: 'Supplier deleted successfully' };
  }
}
