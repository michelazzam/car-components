import { IsEmail, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateOrganizationDto {
  @ApiProperty({ required: true })
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  address: string;

  @ApiProperty({ required: false })
  @IsEmail()
  @IsOptional()
  email: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  phoneNumber: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  tvaNumber: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  tvaPercentage: number;
}
