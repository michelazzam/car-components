import { PartialType } from '@nestjs/swagger';
import { AddItemDto } from './add-item.dto';

export class EditItemDto extends PartialType(AddItemDto) {}
