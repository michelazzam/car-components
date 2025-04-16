import { PartialType } from '@nestjs/swagger';
import { CustomerDto } from './customer.dto';

export class EditCustomerDto extends PartialType(CustomerDto) {}
