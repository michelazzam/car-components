import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Matches } from 'class-validator';

export class GetPurchaseDto {
  @ApiProperty({ required: true, type: Number })
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
  pageIndex: number = 0;

  @ApiProperty({ required: true, type: Number })
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
  pageSize: number = 10;

  @ApiProperty({
    type: String,
    example: '2024/08/01',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Matches(/^[0-9]{4}\/[0-9]{2}\/[0-9]{2}$/, {
    message: 'Date must be in the format YYYY/MM/DD',
  })
  startDate: string;

  @ApiProperty({
    type: String,
    example: '2024/08/01',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Matches(/^[0-9]{4}\/[0-9]{2}\/[0-9]{2}$/, {
    message: 'Date must be in the format YYYY/MM/DD',
  })
  endDate: string;

  @ApiProperty({ required: false })
  @IsOptional()
  search?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  supplierId?: string;
}
