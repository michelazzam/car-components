import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { Trim } from 'src/decorators/trim.decorator';
import { ItemStatus, itemStatuses } from '../item.schema';

export enum PaginationType {
  PAGE = 'paged',
  CURSOR = 'cursor',
}

enum SortBy {
  nameAsc = 'nameAsc',
  nameDesc = 'nameDesc',
  quantityAsc = 'quantityAsc',
  quantityDesc = 'quantityDesc',
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
  @IsEnum(itemStatuses)
  status?: ItemStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(SortBy)
  sortBy?: SortBy;

  @ApiProperty({ required: false })
  @IsOptional()
  @ApiProperty({ required: false })
  @IsOptional()
  //default page , and it can be cursor
  @IsEnum(PaginationType, {
    message: `Pagination type must be one of the following: ${Object.values(
      PaginationType,
    ).join(', ')}`,
  })
  paginationType?: PaginationType;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  nextCursor?: string;
}
