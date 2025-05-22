import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { invoiceTypes } from '../invoice.schema';
import { IsValidDateFormat } from 'src/decorators/isValidDateFormat.decorator';
import { Trim } from 'src/decorators/trim.decorator';

export class GetInvoicesDto {
  @ApiProperty({ required: true, type: Number })
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
  pageIndex: number = 0;

  @ApiProperty({ required: true, type: Number })
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
  pageSize: number = 10;

  @ApiProperty({
    type: String,
    example: '2024-08-01',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsValidDateFormat()
  startDate: string;

  @ApiProperty({
    type: String,
    example: '2024-08-01',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsValidDateFormat()
  endDate: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Trim()
  search?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  customerId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  itemId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @Matches(/^(true|false)$/)
  isPaid: string;

  @ApiProperty({ required: false, enum: invoiceTypes })
  @IsOptional()
  @IsEnum(invoiceTypes)
  type?: string;
}
