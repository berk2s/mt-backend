import { BodyDTO } from '@app/types/controller.types'

export interface UpdateProfilePhotoRequest extends BodyDTO {
  file: any
}
