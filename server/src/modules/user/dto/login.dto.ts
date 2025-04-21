import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Trim } from 'src/decorators/trim.decorator';

export class LoginDto {
  @ApiProperty({
    required: true,
    type: String,
  })
  @IsString()
  @Trim()
  username: string;

  @ApiProperty({
    required: true,
    type: String,
  })
  @IsString()
  @Trim()
  password: string;
}
