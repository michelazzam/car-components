import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';
import { Trim } from 'src/decorators/trim.decorator';

export class AddCustomerDto {
  @ApiProperty({
    required: true,
    type: String,
  })
  @IsString()
  @Trim()
  name: string;

  @ApiProperty({
    required: false,
    type: String,
  })
  @IsEmail()
  @IsOptional()
  @Trim()
  email: string;

  @ApiProperty({
    required: false,
    type: String,
  })
  @IsString()
  @Trim()
  phoneNumber: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @Trim()
  address: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @Trim()
  tvaNumber: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @Trim()
  note: string;
}
