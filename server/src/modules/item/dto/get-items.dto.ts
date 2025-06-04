import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { Trim } from 'src/decorators/trim.decorator';

export enum PaginationType {
  PAGE = 'paged',
  CURSOR = 'cursor',
}

export class GetItemsDto {
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
  @Trim()
  search?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  //default page , and it can be cursor
  @IsEnum(PaginationType, {
    message: `Pagination type must be one of the following: ${Object.values(
      PaginationType,
    ).join(', ')}`,
  })
  paginationType?: PaginationType;
}
