import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNumber, IsOptional, IsString } from 'class-validator';
import { IsValidDateFormat } from 'src/decorators/isValidDateFormat.decorator';

export class ExpenseDto {
  @ApiProperty({
    required: true,
  })
  @IsMongoId()
  @IsOptional()
  expenseTypeId: string;

  @ApiProperty({
    required: false,
  })
  @IsMongoId()
  @IsOptional()
  supplierId: string;

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
  note: string;
}
