import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';
import { Trim } from 'src/decorators/trim.decorator';

export class EditProfileDto {
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
}
