import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
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
  })
  @IsNumber()
  price: number;

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

class PaymentMethod {
  @ApiProperty({
    required: true,
  })
  @IsString()
  method: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  note: string;
}

class Swap {
  @ApiProperty({
    required: true,
  })
  @IsString()
  itemName: string;

  @ApiProperty({
    required: true,
  })
  @IsNumber()
  quantity: number;

  @ApiProperty({
    required: true,
  })
  @IsNumber()
  price: number;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  note: string;
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
    type: PaymentMethod,
    isArray: true,
  })
  @IsArray()
  @ValidateNested()
  @Type(() => PaymentMethod)
  paymentMethods: PaymentMethod[];

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
    required: true,
  })
  @IsNumber()
  taxesUsd: number;

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

  @ApiProperty({
    required: true,
    type: Swap,
    isArray: true,
  })
  @IsArray()
  @ValidateNested()
  @Type(() => Swap)
  swaps: Swap[];
}

// New interface with added fields
export interface InvoiceItemWithDetails extends InvoiceItem {
  cost: number; // Additional cost field for each item
  name: string; // Additional name field for each item
}

export interface InvoiceDtoWithItemsDetails extends Omit<InvoiceDto, 'items'> {
  items: InvoiceItemWithDetails[];
}
