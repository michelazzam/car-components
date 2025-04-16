import { PartialType } from '@nestjs/swagger';
import { AddExpenseTypeDto } from './add-expense-type.dto';

export class EditExpenseTypeDto extends PartialType(AddExpenseTypeDto) {}
