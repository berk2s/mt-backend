import { BodyDTO } from '@app/types/controller.types'

export interface UpdateProfilePhotoRequest extends BodyDTO {
  file: any
}

export class UpdateGymRequest extends BodyDTO {}
