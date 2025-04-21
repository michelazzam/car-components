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
import { AddCustomerDto } from './dto/add-customer.dto';
import { EditCustomerDto } from './dto/edit-customer.dto';
import { GetCustomersDto } from './dto/get-customers.dto';
import { AddVehicleDto } from './dto/add-vehicle.dto';
import { EditVehicleDto } from './dto/edit-vehicle.dto';
import { GetVehiclesDto } from './dto/get-vehicles.dto';
import { Permissions } from '../user/decorators/permissions.decorator';
import { Roles } from '../user/decorators/roles.decorator';

@ApiTags('Customer')
@Controller({ version: '1', path: 'customers' })
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Permissions('Customers', 'read')
  @Get()
  async getAll(@Query() dto: GetCustomersDto) {
    return this.customerService.getAll(dto);
  }

  @Permissions('Customers', 'read')
  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.customerService.getOne(id);
  }

  @Permissions('Customers', 'create')
  @Post()
  async create(@Body() createCustomerDto: AddCustomerDto) {
    await this.customerService.create(createCustomerDto);

    return { message: 'Customer added successfully' };
  }

  @Permissions('Customers', 'update')
  @Put(':id')
  async editCustomer(
    @Param('id') id: string,
    @Body() editCustomerDto: EditCustomerDto,
  ) {
    await this.customerService.editCustomer(id, editCustomerDto);

    return { message: 'Customer updated successfully' };
  }

  @Roles('admin', 'superAmsAdmin')
  @Delete(':id')
  async deleteCustomer(@Param('id') id: string) {
    await this.customerService.deleteCustomer(id);

    return { message: 'Customer deleted successfully' };
  }

  //-------------------------Vehicles------------------------
  @Permissions('Customers', 'read')
  @Get('vehicle')
  async getAllCustomerVehicles(@Query() dto: GetVehiclesDto) {
    return this.customerService.getAllVehicles(dto);
  }

  @Permissions('Customers', 'create')
  @Post(':id/vehicle')
  async addVehicle(@Param('id') id: string, @Body() dto: AddVehicleDto) {
    await this.customerService.addVehicle(id, dto);

    return { message: 'Vehicle added successfully' };
  }

  @Permissions('Customers', 'update')
  @Put(':id/vehicle/:vehicleId')
  async editVehicle(
    @Param('id') id: string,
    @Param('vehicleId') vehicleId: string,
    @Body() dto: EditVehicleDto,
  ) {
    await this.customerService.editVehicle(id, vehicleId, dto);
    return { message: 'Vehicle updated successfully' };
  }

  @Roles('admin', 'superAmsAdmin')
  @Delete(':id/vehicle/:vehicleId')
  async deleteVehicle(
    @Param('id') id: string,
    @Param('vehicleId') vehicleId: string,
  ) {
    await this.customerService.deleteVehicle(id, vehicleId);

    return { message: 'Vehicle deleted successfully' };
  }
}
