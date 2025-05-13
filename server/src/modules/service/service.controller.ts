import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ServiceService } from './service.service';
import { ApiTags } from '@nestjs/swagger';
import { AddServiceDto } from './dto/add-service.dto';
import { EditServiceDto } from './dto/edit-service.dto';
import { Roles } from '../user/decorators/roles.decorator';
import { Permissions } from '../user/decorators/permissions.decorator';

@ApiTags('Service')
@Controller({ version: '1', path: 'services' })
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Permissions('Services', 'read')
  @Get()
  async getAll() {
    return this.serviceService.getAll();
  }

  @Permissions('Services', 'create')
  @Post()
  async create(@Body() dto: AddServiceDto) {
    const service = await this.serviceService.create(dto);

    return { message: 'Service added successfully', data: service };
  }

  @Permissions('Services', 'update')
  @Put(':id')
  async editService(@Param('id') id: string, @Body() dto: EditServiceDto) {
    await this.serviceService.editService(id, dto);

    return { message: 'Service updated successfully' };
  }

  @Roles('admin', 'superAmsAdmin')
  @Delete(':id')
  async deleteService(@Param('id') id: string) {
    await this.serviceService.deleteService(id);

    return { message: 'Service deleted successfully' };
  }
}
