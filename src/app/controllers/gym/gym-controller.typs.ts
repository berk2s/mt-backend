import { BodyDTO } from '@app/types/controller.types'
import { Expose } from 'class-transformer'
import { IsDefined, Length } from 'class-validator'

export class CreateGymRequest extends BodyDTO {
  @IsDefined({
    message: 'gymName.empty',
  })
  @Length(1, 200, {
    message: 'gymName.invalid',
  })
  @Expose()
  gymName: string
}
