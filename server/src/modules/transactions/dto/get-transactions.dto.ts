import { ApiProperty } from '@nestjs/swagger';
import { TransactionType, transactionTypes } from '../transactions.schema';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { Trim } from 'src/decorators/trim.decorator';

export class GetTransactionsDto {
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

  @ApiProperty({
    enum: transactionTypes,
  })
  @IsEnum(transactionTypes)
  @IsOptional()
  transactionType?: TransactionType;

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  startDate: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  endDate: string;
}
