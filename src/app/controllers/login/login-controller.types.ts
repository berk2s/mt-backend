import { BodyDTO } from '@app/types/controller.types'
import { Expose } from 'class-transformer'
import { IsDefined } from 'class-validator'

/**
 * Login Request Body
 */
export class LoginRequest extends BodyDTO {
  @IsDefined({
    message: 'email.empty',
  })
  @Expose()
  email?: String

  @IsDefined({
    message: 'password.empty',
  })
  @Expose()
  password?: String
}

export class LoginResponse {
  accessToken: string
  expiresIn: number
}
