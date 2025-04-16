import { PartialType } from '@nestjs/swagger';
import { AddCustomerDto } from './add-customer.dto';

export class EditCustomerDto extends PartialType(AddCustomerDto) {}
