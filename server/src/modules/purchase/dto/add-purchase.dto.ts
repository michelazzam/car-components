import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  ValidateNested,
} from 'class-validator';

class Item {
  @ApiProperty({
    required: true,
  })
  @IsMongoId()
  item: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  description: string;

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
    required: false,
  })
  @IsNumber()
  @IsOptional()
  quantityFree: number = 0;

  @ApiProperty({
    required: false,
  })
  @IsNumber()
  discount: number = 0;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  lotNumber: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  expDate: string;

  @ApiProperty({
    required: false,
  })
  totalPrice: number;
}

export class AddPurchaseDto {
  @ApiProperty({
    required: true,
  })
  @IsMongoId()
  supplierId: string;

  @ApiProperty({
    example: '2024-08-01',
    required: true,
  })
  @IsString()
  @Matches(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/, {
    message: 'Date must be in the format YYYY-MM-DD',
  })
  invoiceDate: string;

  @ApiProperty({
    required: true,
  })
  @IsString()
  invoiceNumber: string;

  @ApiProperty({
    required: true,
  })
  @IsString()
  customerConsultant: string;

  @ApiProperty({
    required: true,
  })
  @IsString()
  phoneNumber: string;

  @ApiProperty({
    required: true,
  })
  @IsNumber()
  vatPercent: number;

  @ApiProperty({
    required: true,
  })
  @IsNumber()
  vatLBP: number;

  @ApiProperty({
    required: true,
  })
  @IsNumber()
  totalAmount: number;

  @ApiProperty({
    required: true,
  })
  @IsNumber()
  amountPaid: number;

  @ApiProperty({
    required: true,
    type: Item,
  })
  @ValidateNested()
  @Type(() => Item)
  items: Item[];
}
