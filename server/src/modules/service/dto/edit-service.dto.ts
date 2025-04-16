import { PartialType } from '@nestjs/swagger';
import { AddServiceDto } from './add-service.dto';

export class EditServiceDto extends PartialType(AddServiceDto) {}
