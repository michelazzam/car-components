import { PartialType } from '@nestjs/swagger';
import { CreateAppTokenDto } from './create-app-token.dto';

export class UpdateAppTokenDto extends PartialType(CreateAppTokenDto) {}
