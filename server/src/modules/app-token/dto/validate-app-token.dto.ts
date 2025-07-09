import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ValidateAppTokenDto {
  @ApiProperty({ required: true })
  @IsString()
  token: string;
}
