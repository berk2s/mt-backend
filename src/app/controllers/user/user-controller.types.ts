import { BodyDTO } from '@app/types/controller.types'
import { ObjectIdValidator } from '@app/validation/ObjectIdValidator'
import { Expose } from 'class-transformer'
import { IsDefined, Validate } from 'class-validator'

export interface UpdateProfilePhotoRequest extends BodyDTO {
  file: any
}
