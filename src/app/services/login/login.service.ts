/**
 * @module app.services.login
 */

import tokenConfig from '@app/config/token.config'
import {
  LoginRequest,
  LoginResponse,
} from '@app/controllers/login/login-controller.types'
import { BadCredentials } from '@app/exceptions/bad-credentials-error'
import { BaseUser } from '@app/model/user/BaseUser'
import { HashUtility } from '@app/utilities/hash-utility'
import jwtService from '../jwt/jwt.service'
import loggerService from '../logger/logger-service'

/**
 * Login Service
 * Handles login operations
 *
 * @class
 * @alies app.services.login.LoginService
 */
export class LoginService {
  /**
   * Logs in the User
   * Returns access token with expiry time
   */
  public async login(req: LoginRequest): Promise<LoginResponse> {
    const { email, password } = req
    const user = await BaseUser.findOne({ email: email })

    if (!user) {
      loggerService.warn(
        `User with given email doesn't exists [email: ${email}]`,
      )
      throw new BadCredentials('credentials.invalid')
    }

    if (!HashUtility.compare(password, user.passwordHash)) {
      loggerService.warn(`Passwords are not matching [email: ${email}]`)
      throw new BadCredentials('credentials.invalid')
    }

    const token = await jwtService.generate({
      userId: user._id,
      fullName: user.fullName,
    })

    loggerService.info(`User successfully logged in [userId: ${user._id}}`)

    return {
      accessToken: token,
      expiresIn: tokenConfig.expiresIn,
    }
  }
}

export default new LoginService()
