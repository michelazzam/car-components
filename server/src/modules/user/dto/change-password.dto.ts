import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Trim } from 'src/decorators/trim.decorator';

export class ChangePasswordDto {
  @ApiProperty({
    required: true,
    type: String,
  })
  @IsString()
  @Trim()
  currentPassword: string;

  @ApiProperty({
    required: false,
    type: String,
  })
  @IsString()
  @Trim()
  newPassword: string;
}
