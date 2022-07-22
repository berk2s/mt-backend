/**
 * @module app.validation
 */
import { ObjectIdUtility } from '@app/utilities/objectid-utility'
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator'

@ValidatorConstraint({ name: 'objectIdValidator', async: false })
export class ObjectIdValidator implements ValidatorConstraintInterface {
  validate(text: string, args: ValidationArguments): boolean {
    return ObjectIdUtility.isValid(text)
  }

  defaultMessage(args: ValidationArguments) {
    return 'objectId.invalid'
  }
}
