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
  async create(@Body() dto: AddSupplierDto) {
    await this.supplierService.create(dto);

    return { message: 'Supplier added successfully' };
  }

  @Put(':id')
  async editSupplier(@Param('id') id: string, @Body() dto: EditSupplierDto) {
    await this.supplierService.editSupplier(id, dto);

    return { message: 'Supplier updated successfully' };
  }

  @Delete(':id')
  async deleteSupplier(@Param('id') id: string) {
    await this.supplierService.deleteSupplier(id);

    return { message: 'Supplier deleted successfully' };
  }
}
