import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  Validate,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import {
  DiscountType,
  discountTypes,
  InvoiceType,
  invoiceTypes,
} from '../invoice.schema';
import { AtLeastOneFieldRequired } from './AtLeastOneFieldRequired.decorator';

class Discount {
  @ApiProperty({
    required: true,
  })
  @IsNumber()
  amount: number;

  @ApiProperty({
    required: true,
    type: String,
    enum: discountTypes,
  })
  @IsEnum(discountTypes)
  type: DiscountType;
}

class InvoiceItem {
  @ApiProperty({
    required: true,
  })
  @IsMongoId()
  @IsOptional()
  @ValidateIf((o) => !o.serviceRef) // Validate if serviceRef is not provided
  @Validate(AtLeastOneFieldRequired)
  itemRef: string;

  @ApiProperty({
    required: true,
  })
  @IsMongoId()
  @IsOptional()
  @ValidateIf((o) => !o.itemRef) // Validate if itemRef is not provided
  @Validate(AtLeastOneFieldRequired)
  serviceRef: string;

  @ApiProperty({
    required: true,
  })
  @IsNumber()
  quantity: number;

  @ApiProperty({
    required: true,
    type: Discount,
  })
  @ValidateNested()
  @Type(() => Discount)
  discount: Discount;

  @ApiProperty({ required: true })
  @IsNumber()
  subTotal: number;

  @ApiProperty({ required: true })
  @IsNumber()
  totalPrice: number;
}

export class InvoiceDto {
  @ApiProperty({
    required: false,
  })
  @IsMongoId()
  @IsOptional()
  customerId: string;

  @ApiProperty({
    required: false,
  })
  @IsMongoId()
  @IsOptional()
  vehicleId: string;

  @ApiProperty({
    required: true,
    type: String,
    enum: invoiceTypes,
  })
  @IsEnum(invoiceTypes)
  type: InvoiceType;

  @ApiProperty({
    required: true,
    type: Discount,
  })
  @ValidateNested()
  @Type(() => Discount)
  discount: Discount;

  @ApiProperty({
    required: true,
  })
  @IsBoolean()
  isPaid: boolean;

  @ApiProperty({
    required: true,
  })
  @IsNumber()
  paidAmountUsd: number;

  @ApiProperty({
    required: true,
  })
  @IsNumber()
  subTotalUsd: number;

  @ApiProperty({
    required: true,
  })
  @IsNumber()
  totalUsd: number;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  driverName: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  generalNote: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  customerNote: string;

  @ApiProperty({
    required: true,
    type: InvoiceItem,
    isArray: true,
  })
  @IsArray()
  @ValidateNested()
  @Type(() => InvoiceItem)
  items: InvoiceItem[];
}
