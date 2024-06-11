import {
  ValidatorConstraintInterface,
  ValidationArguments,
  ValidatorConstraint,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class CustomEmailConstraint implements ValidatorConstraintInterface {
  validate(email: any, args: ValidationArguments) {
    return (
      email.includes('@etu.univ-batna2.dz') || email.includes('@univ-batna2.dz')
    );
  }

  defaultMessage(args: ValidationArguments) {
    return 'Email must belongs to Université de Batna 2';
  }
}
