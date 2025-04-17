import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNumber, IsOptional, IsString } from 'class-validator';

export class AddExpenseDto {
  @ApiProperty({
    required: true,
  })
  @IsMongoId()
  expenseTypeId: string;

  @ApiProperty({
    example: '2024-08-01',
    required: true,
  })
  @IsString()
  // @Matches(/^[0-9]{4}\/[0-9]{2}\/[0-9]{2}$/, {
  //   message: 'Date must be in the format YYYY/MM/DD',
  // })
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
