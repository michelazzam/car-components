import { PartialType } from '@nestjs/swagger';
import { AddSupplierDto } from './add-supplier.dto';

export class EditSupplierDto extends PartialType(AddSupplierDto) {}
