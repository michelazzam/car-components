import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { VehicleMakesService } from './vehicle-makes.service';
import { ApiTags } from '@nestjs/swagger';
import { VehicleMakeDto } from './dto/vehicle-make.dto';
import { Roles } from '../user/decorators/roles.decorator';
import { Permissions } from '../user/decorators/permissions.decorator';
import { ModelDto } from './dto/model.dto';

@ApiTags('Makes & Models')
@Controller({ version: '1', path: 'makes' })
export class VehicleMakesController {
  constructor(private readonly vehicleMakesService: VehicleMakesService) {}

  @Permissions('VehicleMakes', 'read')
  @Get()
  async getAll() {
    return this.vehicleMakesService.getAll();
  }

  @Permissions('VehicleMakes', 'create')
  @Post()
  async createMake(@Body() dto: VehicleMakeDto) {
    const make = await this.vehicleMakesService.createMake(dto);

    return { message: 'Make added successfully', data: make };
  }

  @Permissions('VehicleMakes', 'update')
  @Put(':id')
  async editMake(@Param('id') id: string, @Body() dto: VehicleMakeDto) {
    await this.vehicleMakesService.editMake(id, dto);

    return { message: 'Make updated successfully' };
  }

  @Roles('admin', 'superAmsAdmin')
  @Delete(':id')
  async deleteMake(@Param('id') id: string) {
    await this.vehicleMakesService.deleteMake(id);

    return { message: 'Make deleted successfully' };
  }

  @Permissions('VehicleMakes', 'create')
  @Post('models/:makeId')
  async createModel(@Param('makeId') makeId: string, @Body() dto: ModelDto) {
    const make = await this.vehicleMakesService.createModel(makeId, dto);

    return { message: 'Model added successfully', data: make };
  }

  @Permissions('VehicleMakes', 'update')
  @Put('models/:makeId/:id')
  async editModel(
    @Param('makeId') makeId: string,
    @Param('id') id: string,
    @Body() dto: ModelDto,
  ) {
    await this.vehicleMakesService.editModel(makeId, id, dto);

    return { message: 'Model updated successfully' };
  }

  @Roles('admin', 'superAmsAdmin')
  @Delete('models/:makeId/:id')
  async deleteModel(@Param('makeId') makeId: string, @Param('id') id: string) {
    await this.vehicleMakesService.deleteModel(makeId, id);

    return { message: 'Model deleted successfully' };
  }
}
