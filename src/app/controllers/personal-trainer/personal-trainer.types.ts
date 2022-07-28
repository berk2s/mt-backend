import { BodyDTO } from '@app/types/controller.types'
import { Expose } from 'class-transformer'
import { IsDefined, Min } from 'class-validator'
import { RegisterUserRequest } from '../athlete/athlete-controller.types'

export class RegisterPersonalTrainer extends RegisterUserRequest {
  @IsDefined({
    message: 'yearsOfExperience.empty',
  })
  @Min(1, {
    message: 'yearsOfExperience.invalid',
  })
  @Expose()
  yearsOfExperience: number

  @IsDefined({
    message: 'gym.empty',
  })
  @Expose()
  gym: string

  @IsDefined({
    message: 'iban.empty',
  })
  @Expose()
  iban: string
}

export interface AddCertificateImagesRequest extends BodyDTO {
  files: any
}
