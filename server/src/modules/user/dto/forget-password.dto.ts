import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';
import { Trim } from 'src/decorators/trim.decorator';

export class ForgetPasswordDto {
  @ApiProperty({
    required: false,
    type: String,
  })
  @IsEmail()
  @Trim()
  email: string;
}
