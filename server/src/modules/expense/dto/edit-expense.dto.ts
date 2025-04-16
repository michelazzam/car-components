import { PartialType } from '@nestjs/swagger';
import { AddExpenseDto } from './add-expense.dto';

export class EditExpenseDto extends PartialType(AddExpenseDto) {}
