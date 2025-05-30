import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ItemStatus, itemStatuses } from '../item.schema';

export class AddItemDto {
  @ApiProperty({
    required: true,
  })
  @IsString()
  name: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  note: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  locationInStore: string;

  @ApiProperty({ required: false })
  @IsMongoId()
  @IsOptional()
  supplierId: string;

  @ApiProperty({
    required: true,
  })
  @IsNumber()
  cost: number;

  @ApiProperty({
    required: true,
  })
  @IsNumber()
  price: number;

  @ApiProperty({
    required: true,
  })
  @IsNumber()
  quantity: number;

  @ApiProperty({
    required: true,
    type: String,
    enum: itemStatuses,
  })
  @IsEnum(itemStatuses)
  status: ItemStatus;
}
