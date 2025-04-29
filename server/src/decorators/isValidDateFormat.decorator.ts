import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';

@ValidatorConstraint({ name: 'isDateFormat', async: false })
export class IsDateFormatValidator implements ValidatorConstraintInterface {
  validate(value: any) {
    // Regular expression for date in format YYYY-MM-DD
    const regex = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/;
    return typeof value === 'string' && regex.test(value);
  }

  defaultMessage(): string {
    return 'Date must be in the format YYYY-MM-DD'; // Default message
  }
}

export function IsValidDateFormat(validationOptions?: ValidationOptions) {
  return (object: object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsDateFormatValidator,
    });
  };
}
