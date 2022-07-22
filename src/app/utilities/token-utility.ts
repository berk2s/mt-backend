/**
 * @module app.utilities
 */

import tokenConfig from '@app/config/token.config'
import { TokenResponse } from '@app/controllers/login/login-controller.types'
import { BaseUserDocument } from '@app/model/user/BaseUser'

export abstract class TokenUtility {
  public static generatePayload(user: BaseUserDocument): any {
    return {
      userId: user._id,
      fullName: user.fullName,
      userType: user.userType,
    }
  }

  public static generateResponse(token: string): TokenResponse {
    return {
      accessToken: token,
      expiresIn: tokenConfig.expiresIn,
    }
  }
}
