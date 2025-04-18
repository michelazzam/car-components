import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, MinLength } from 'class-validator';

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
}
