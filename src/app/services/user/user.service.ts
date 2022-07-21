/**
 * @module app.services.user
 */

import { RegisterAthleteRequest } from '@app/controllers/athlete-controller/athlete-controller.types'
import { DocumentExists } from '@app/exceptions/document-exists-error'
import { DocumentNotFound } from '@app/exceptions/document-not-found-error'
import { UserMapper } from '@app/mappers/user.mapper'
import { AthleteUser } from '@app/model/user/Athlete'
import { BaseUser, BaseUserModel } from '@app/model/user/BaseUser'
import { UserResponse } from '@app/types/response.types'
import { ObjectIdUtility } from '@app/utilities/objectid-utility'
import { ObjectId } from 'mongoose'
import { loggers } from 'winston'
import imageService from '../image/image.service'
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
  ): Promise<UserResponse> {
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

    loggerService.info(`User has been created [userId: ${athlete._id}]`)

    return Promise.resolve(UserMapper.userToDTO(athlete))
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
}

export default new UserService()
