/**
 * @module app.services.user
 */

import { RegisterAthleteRequest } from '@app/controllers/athlete/athlete-controller.types'
import { TokenResponse } from '@app/controllers/login/login-controller.types'
import { DocumentExists } from '@app/exceptions/document-exists-error'
import { DocumentNotFound } from '@app/exceptions/document-not-found-error'
import { UserMapper } from '@app/mappers/user.mapper'
import { AthleteUser } from '@app/model/user/Athlete'
import { BaseUser, BaseUserModel } from '@app/model/user/BaseUser'
import { UserResponse } from '@app/types/response.types'
import { ObjectIdUtility } from '@app/utilities/objectid-utility'
import { TokenUtility } from '@app/utilities/token-utility'
import { ObjectId } from 'mongoose'
import { loggers } from 'winston'
import imageService from '../image/image.service'
import jwtService from '../jwt/jwt.service'
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

  /**
   * Registers athlete user type to the database
   */
  public async registerAthlete(
    registerUser: RegisterAthleteRequest,
  ): Promise<TokenResponse> {
    const {
      fullName,
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
      email,
      passwordHash: password,
      birthDate: birthday,
      sex: gender,
      languages,
      trainingExperience,
      trainingDays,
    })

    await athlete.save()

    loggerService.info(`User succesfully created [userId: ${athlete._id}]`)

    const token = await jwtService.generate(
      TokenUtility.generatePayload(athlete),
    )

    return TokenUtility.generateResponse(token)
  }

  /**
   * Updates user profile photo
   */
  public async updateProfilePhoto(
    userId: string,
    buffer: any,
  ): Promise<UserResponse> {
    if (!ObjectIdUtility.isValid(userId)) {
      loggerService.warn(`Given object id is invalid [id: ${userId}]`)
      throw new DocumentNotFound('user.notFound')
    }

    const user = await this.baseUserModel.findById(userId)

    if (!user) {
      loggerService.warn(
        `User with given ID does not exists [userId: ${userId}]`,
      )
      throw new DocumentNotFound('user.notFound')
    }

    const fileName = await imageService.save(buffer)

    user.imageUrl = fileName
    user.save()

    loggerService.info(
      `User profile photo has been updated. [userId: ${user._id}]`,
    )

    return Promise.resolve(UserMapper.baseUsertoDTO(user))
  }

  /**
   * Checks user exists or not
   */
  public async existsById(userId: string): Promise<boolean> {
    const doesUserExists = await this.baseUserModel.exists({
      _id: userId,
    })

    return Promise.resolve(doesUserExists ? true : false)
  }
}

export default new UserService()
