import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CloseOpenCaisseDto {
  @ApiProperty({ required: true })
  @IsNumber()
  amount: number;
}
