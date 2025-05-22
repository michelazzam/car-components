import { ApiProperty } from '@nestjs/swagger';
import {
  IsMongoId,
  IsNumber,
  IsOptional,
  IsPositive,
  Min,
} from 'class-validator';

export class PayCustomerInvoicesDto {
  @ApiProperty({ required: true })
  @IsMongoId()
  customerId: string;

  @ApiProperty({ required: true })
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @IsPositive()
  discount: number = 0;
}
