import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Matches } from 'class-validator';

export class GetReportsSumDto {
  @ApiProperty({
    type: String,
    example: '2024/08/01',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Matches(/^[0-9]{4}\/[0-9]{2}\/[0-9]{2}$/, {
    message: 'Date must be in the format YYYY/MM/DD',
  })
  startDate: string;

  @ApiProperty({
    type: String,
    example: '2024/08/01',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Matches(/^[0-9]{4}\/[0-9]{2}\/[0-9]{2}$/, {
    message: 'Date must be in the format YYYY/MM/DD',
  })
  endDate: string;
}
