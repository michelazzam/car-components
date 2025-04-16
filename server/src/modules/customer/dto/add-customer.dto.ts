import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class AddCustomerDto {
  @ApiProperty({
    required: true,
    type: String,
  })
  @IsString()
  name: string;

  @ApiProperty({
    required: false,
    type: String,
  })
  @IsEmail()
  @IsOptional()
  email: string;

  @ApiProperty({
    required: false,
    type: String,
  })
  @IsString()
  @IsOptional()
  phoneNumber: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  address: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  tvaNumber: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  note: string;
}
