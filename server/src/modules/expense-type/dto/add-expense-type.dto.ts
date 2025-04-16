import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AddExpenseTypeDto {
  @ApiProperty({
    required: true,
    type: String,
  })
  @IsString()
  name: string;
}
