import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { IsValidDateFormat } from 'src/decorators/isValidDateFormat.decorator';

export class ExpenseDto {
  @ApiProperty({
    required: true,
  })
  @IsMongoId()
  @IsOptional()
  expenseTypeId: string | null;

  @ApiProperty({
    required: false,
  })
  @IsMongoId()
  @IsOptional()
  supplierId: string | null;

  @ApiProperty({
    required: false,
    isArray: true,
    type: String,
  })
  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  purchasesIds: string[] = [];

  @ApiProperty({
    example: '2024-08-01',
    required: true,
  })
  @IsString()
  @IsValidDateFormat()
  date: string;

  @ApiProperty({
    required: true,
  })
  @IsNumber()
  amount: number;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  note: string | null;
}
