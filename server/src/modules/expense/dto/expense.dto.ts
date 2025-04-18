import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNumber, IsOptional, IsString } from 'class-validator';

export class ExpenseDto {
  @ApiProperty({
    required: true,
  })
  @IsMongoId()
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
