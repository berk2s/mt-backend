/**
 * @module app.services.user
 */

import { RegisterUserRequest } from '@app/controllers/register-controller/register-controller.types'
import { UserMapper } from '@app/mappers/user.mapper'
import { NormalUser } from '@app/model/user/User'
import { UserResponse } from '@app/types/response.types'
import loggerService from '../logger/logger-service'

/**
 * User service
 * @class
 * @alias app.services.user.UserService
 */
class UserService {
  public async register(
    registerUser: RegisterUserRequest,
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

    const user = new NormalUser({
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

    await user.save()

    loggerService.info(`User has been created [userId: ${user._id}]`)

    return Promise.resolve(UserMapper.userToDTO(user))
  }
}

export default new UserService()
