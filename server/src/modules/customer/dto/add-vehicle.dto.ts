import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString, MinLength } from 'class-validator';
import { OdometerUnit, odometerUnits } from '../customer.schema';

export class AddVehicleDto {
  @ApiProperty({
    required: true,
    type: String,
  })
  @IsString()
  make: string;

  @ApiProperty({
    required: true,
    type: String,
  })
  @MinLength(1, { message: 'Model is required' })
  @IsString()
  model: string;

  @ApiProperty({
    required: true,
    type: String,
  })
  @IsString()
  number: string;

  @ApiProperty({ required: false })
  @IsNumber()
  odometer: number;

  @ApiProperty({
    required: true,
    type: String,
    enum: odometerUnits,
  })
  @IsEnum(odometerUnits)
  unit: OdometerUnit;
}
