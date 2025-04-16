import { Validate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PermissionsValidator } from '../decorators/permissionsValidator.decorator';

export class EditUserPermissionsDto {
  @ApiProperty({
    description: 'User permissions',
    type: Object,
    required: true,
  })
  @Validate(PermissionsValidator)
  permissions: Record<string, Record<string, boolean>>;
}
