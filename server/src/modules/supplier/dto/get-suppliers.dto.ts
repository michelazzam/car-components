import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class GetSuppliersDto {
  @ApiProperty({ required: true, type: Number })
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
  pageIndex: number = 0;

  @ApiProperty({ required: true, type: Number })
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
  pageSize: number = 10;

  @ApiProperty({ required: false })
  @IsOptional()
  search?: string;
}
