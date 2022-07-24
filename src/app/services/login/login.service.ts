/**
 * @module app.services.login
 */

import tokenConfig from '@app/config/token.config'
import {
  LoginRequest,
  TokenResponse,
} from '@app/controllers/login/login-controller.types'
import { BadCredentials } from '@app/exceptions/bad-credentials-error'
import { BaseUser } from '@app/model/user/BaseUser'
import { HashUtility } from '@app/utilities/hash-utility'
import { TokenUtility } from '@app/utilities/token-utility'
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
  public async login(req: LoginRequest): Promise<TokenResponse> {
    const { email, password } = req
    const user = await BaseUser.findOne({ email: email })

    if (!user) {
      loggerService.warn(
        `User with given email doesn't exists [email: ${email}]`,
      )
      throw new BadCredentials('credentials.invalid')
    }

    if (!(await HashUtility.compare(password, user.passwordHash))) {
      loggerService.warn(`Passwords are not matching [email: ${email}]`)
      throw new BadCredentials('credentials.invalid')
    }

    const token = await jwtService.generate(TokenUtility.generatePayload(user))

    loggerService.info(`User successfully logged in [userId: ${user._id}}`)

    return TokenUtility.generateResponse(token)
  }
}

export default new LoginService()
