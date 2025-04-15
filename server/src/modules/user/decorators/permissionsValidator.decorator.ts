import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { userPermissions } from '../interfaces/user.permissions';

@ValidatorConstraint({ async: false })
export class PermissionsValidator implements ValidatorConstraintInterface {
  validate(permissions: any) {
    // Loop through userPermissions and validate each key and its actions
    const userPermissionsKeys = Object.keys(userPermissions);

    // Check if the permission keys match the userPermissions structure
    return userPermissionsKeys.every((key) => {
      const actions = userPermissions[key];
      // Check if all actions are booleans
      return Object.keys(actions).every(
        (action) => typeof permissions[key]?.[action] === 'boolean',
      );
    });
  }

  defaultMessage() {
    return 'Invalid permissions structure';
  }
}
