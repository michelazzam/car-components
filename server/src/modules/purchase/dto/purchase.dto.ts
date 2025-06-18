import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { IsValidDateFormat } from 'src/decorators/isValidDateFormat.decorator';

class ReturnedItem {
  @ApiProperty({
    required: false,
  })
  @IsNumber()
  quantityReturned: number = 0;

  @ApiProperty({
    example: '2024-08-01',
    required: true,
  })
  @IsString()
  @IsValidDateFormat()
  returnedAt: string;
}

class PurchaseItem {
  @ApiProperty({
    required: true,
  })
  @IsMongoId()
  itemId: string;

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
  @Min(1)
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
  @IsNumber()
  totalPrice: number;

  @ApiProperty({
    required: true,
    type: ReturnedItem,
    isArray: true,
  })
  @IsArray()
  @IsOptional()
  @ValidateNested()
  @Type(() => ReturnedItem)
  returns: ReturnedItem[] = [];
}

export class PurchaseDto {
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
  @IsValidDateFormat()
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
  @IsOptional()
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
    required: false,
  })
  @IsNumber()
  @IsOptional()
  subTotal: number = 0;

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
    type: PurchaseItem,
    isArray: true,
  })
  @IsArray()
  @ValidateNested()
  @Type(() => PurchaseItem)
  items: PurchaseItem[];
}
