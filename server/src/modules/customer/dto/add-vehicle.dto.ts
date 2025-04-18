import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class AddVehicleDto {
  @ApiProperty({
    required: true,
    type: String,
  })
  @IsString()
  make: string;

  @ApiProperty({
    required: false,
    type: String,
  })
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
