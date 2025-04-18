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

@ApiTags('Customer')
@Controller({ version: '1', path: 'customers' })
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get()
  async getAll(@Query() dto: GetCustomersDto) {
    return this.customerService.getAll(dto);
  }

  @Get('vehicle')
  async getAllCustomerVehicles(@Query() dto: GetVehiclesDto) {
    return this.customerService.getAllVehicles(dto);
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.customerService.getOne(id);
  }

  @Post()
  async create(@Body() createCustomerDto: AddCustomerDto) {
    await this.customerService.create(createCustomerDto);

    return { message: 'Customer added successfully' };
  }

  @Put(':id')
  async editCustomer(
    @Param('id') id: string,
    @Body() editCustomerDto: EditCustomerDto,
  ) {
    await this.customerService.editCustomer(id, editCustomerDto);

    return { message: 'Customer updated successfully' };
  }

  @Delete(':id')
  async deleteCustomer(@Param('id') id: string) {
    await this.customerService.deleteCustomer(id);

    return { message: 'Customer deleted successfully' };
  }

  //-------------------------Vehicles------------------------

  @Put(':id/vehicle/:vehicleId')
  async editVehicle(
    @Param('id') id: string,
    @Param('vehicleId') vehicleId: string,
    @Body() dto: EditVehicleDto,
  ) {
    await this.customerService.editVehicle(id, vehicleId, dto);
    return { message: 'Vehicle updated successfully' };
  }

  @Post(':id/vehicle')
  async addVehicle(@Param('id') id: string, @Body() dto: AddVehicleDto) {
    await this.customerService.addVehicle(id, dto);

    return { message: 'Vehicle added successfully' };
  }

  @Delete(':id/vehicle/:vehicleId')
  async deleteVehicle(
    @Param('id') id: string,
    @Param('vehicleId') vehicleId: string,
  ) {
    await this.customerService.deleteVehicle(id, vehicleId);

    return { message: 'Vehicle deleted successfully' };
  }
}
