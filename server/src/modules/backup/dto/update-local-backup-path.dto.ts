import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Trim } from 'src/decorators/trim.decorator';

export class UpdateLocalBackupPathDto {
  @ApiProperty({
    required: true,
    type: String,
  })
  @IsString()
  @Trim()
  path: string;
}
