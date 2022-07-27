/**
 * @module app.utilities
 */

import tokenConfig from '@app/config/token.config'
import { TokenResponse } from '@app/controllers/login/login-controller.types'
import { AthleteUserDocument } from '@app/model/user/Athlete'
import { BaseUserDocument } from '@app/model/user/BaseUser'

export abstract class TokenUtility {
  public static generatePayload(
    user: BaseUserDocument | AthleteUserDocument,
  ): any {
    return {
      userId: user._id,
      fullName: user.fullName,
      userType: user.userType,
      userEmail: user.email,
      isPremium:
        'isPremium' in user ? (user.isPremium ? user.isPremium : false) : false,
    }
  }

  public static generateResponse(token: string): TokenResponse {
    return {
      accessToken: token,
      expiresIn: tokenConfig.expiresIn,
    }
  }
}
