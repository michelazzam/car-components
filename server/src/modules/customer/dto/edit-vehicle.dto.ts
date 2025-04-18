import { PartialType } from '@nestjs/swagger';
import { AddVehicleDto } from './add-vehicle.dto';

export class EditVehicleDto extends PartialType(AddVehicleDto) {}
