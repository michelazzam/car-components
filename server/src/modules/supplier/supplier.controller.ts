import {
  Get,
  Post,
  Body,
  Put,
  Delete,
  Param,
  Controller,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { ApiTags } from '@nestjs/swagger';
import { GetSuppliersDto } from './dto/get-suppliers.dto';
import { AddSupplierDto } from './dto/add-supplier.dto';
import { EditSupplierDto } from './dto/edit-supplier.dto';
import { Roles } from '../user/decorators/roles.decorator';
import { Permissions } from '../user/decorators/permissions.decorator';

@ApiTags('Supplier')
@Controller({ version: '1', path: 'suppliers' })
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  @Permissions('Suppliers', 'read')
  @Get()
  async getAll(@Query() dto: GetSuppliersDto) {
    return this.supplierService.getAll(dto);
  }

  @Permissions('Suppliers', 'read')
  @Get(':id')
  async getOne(@Param('id') id: string) {
    const supplier = await this.supplierService.getOneById(id);
    if (!supplier) throw new NotFoundException('Supplier not found');
    return supplier;
  }

  @Permissions('Suppliers', 'create')
  @Post()
  async create(@Body() dto: AddSupplierDto) {
    await this.supplierService.create(dto);

    return { message: 'Supplier added successfully' };
  }

  @Permissions('Suppliers', 'update')
  @Put(':id')
  async editSupplier(@Param('id') id: string, @Body() dto: EditSupplierDto) {
    await this.supplierService.editSupplier(id, dto);

    return { message: 'Supplier updated successfully' };
  }

  @Roles('admin', 'superAmsAdmin')
  @Delete(':id')
  async deleteSupplier(@Param('id') id: string) {
    await this.supplierService.deleteSupplier(id);

    return { message: 'Supplier deleted successfully' };
  }
}
