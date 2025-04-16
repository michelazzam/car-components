import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class GetCustomersDto {
  @ApiProperty({ required: true })
  @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
  pageIndex: number = 0;

  @ApiProperty({ required: true })
  @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
  pageSize: number = 10;

  @ApiProperty({ required: false })
  @IsOptional()
  search?: string;
}
