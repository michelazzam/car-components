import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class UpdateUsdRateDto {
  @ApiProperty({ required: false })
  @IsNumber()
  usdRate: number;
}
