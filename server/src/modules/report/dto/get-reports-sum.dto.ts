import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { IsValidDateFormat } from 'src/decorators/isValidDateFormat.decorator';

export class GetReportsSumDto {
  @ApiProperty({
    type: String,
    example: '2024-08-01',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsValidDateFormat()
  startDate: string;

  @ApiProperty({
    type: String,
    example: '2024-08-01',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsValidDateFormat()
  endDate: string;
}
