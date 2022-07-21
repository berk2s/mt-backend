/**
 * @module app.services.user
 */

import { RegisterAthleteRequest } from '@app/controllers/athlete-controller/athlete-controller.types'
import { DocumentExists } from '@app/exceptions/document-exists-error'
import { UserMapper } from '@app/mappers/user.mapper'
import { AthleteUser } from '@app/model/user/Athlete'
import { BaseUser, BaseUserModel } from '@app/model/user/BaseUser'
import { UserResponse } from '@app/types/response.types'
import loggerService from '../logger/logger-service'

/**
 * User service
 * @class
 * @alias app.services.user.UserService
 */
class UserService {
  private baseUserModel: BaseUserModel

  constructor() {
    this.baseUserModel = BaseUser
  }

  public async registerAthlete(
    registerUser: RegisterAthleteRequest,
  ): Promise<UserResponse> {
    const {
      fullName,
      imageUrl,
      email,
      password,
      birthday,
      gender,
      languages,
      trainingDays,
      trainingExperience,
    } = registerUser

    const isEmailTaken = await this.baseUserModel.exists({ email })

    if (isEmailTaken) {
      loggerService.warn(
        `User with given email already exists [email: ${email}]`,
      )
      throw new DocumentExists('email.exists')
    }

    const athlete = new AthleteUser({
      fullName,
      imageUrl,
      email,
      passwordHash: password,
      birthDate: birthday,
      sex: gender,
      languages,
      trainingExperience,
      trainingDays,
    })

    await athlete.save()

    loggerService.info(`User has been created [userId: ${athlete._id}]`)

    return Promise.resolve(UserMapper.userToDTO(athlete))
  }
}

export default new UserService()
