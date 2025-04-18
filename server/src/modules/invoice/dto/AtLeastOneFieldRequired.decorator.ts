import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

// Custom validator to ensure at least one of the fields is provided
@ValidatorConstraint({ async: false })
export class AtLeastOneFieldRequired implements ValidatorConstraintInterface {
  validate(_: any, args: ValidationArguments): boolean {
    // If both fields are empty, it's invalid
    const object = args.object as any;
    return object.itemRef || object.serviceRef;
  }

  defaultMessage(_: ValidationArguments): string {
    return 'At least one of itemRef or serviceRef must be provided';
  }
}
