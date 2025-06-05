import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Trim } from 'src/decorators/trim.decorator';

export class AddServiceDto {
  @ApiProperty({
    required: true,
    type: String,
  })
  @IsString()
  @Trim()
  name: string;

  @ApiProperty({
    required: false,
    type: Number,
  })
  @IsNumber()
  @IsOptional()
  price: number;
}
