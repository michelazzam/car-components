import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { UserRole, userRoles } from '../user.schema';
import { Trim } from 'src/decorators/trim.decorator';

export class AddUserDto {
  @ApiProperty({
    required: true,
    type: String,
  })
  @IsString()
  @Trim()
  username: string;

  @ApiProperty({
    required: false,
    type: String,
  })
  @IsEmail()
  @Trim()
  @IsOptional()
  email: string;

  @ApiProperty({
    required: false,
    type: String,
  })
  @IsString()
  @Trim()
  @IsOptional()
  password: string;

  @ApiProperty({
    required: false,
    type: Number,
  })
  @IsNumber()
  @IsOptional()
  salary: number;

  @ApiProperty({
    required: true,
    type: String,
    enum: userRoles,
  })
  @IsEnum(userRoles)
  role: UserRole;
}
