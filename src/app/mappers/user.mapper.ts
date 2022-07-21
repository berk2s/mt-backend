/**
 * @module app.mappers
 */

import { BaseUserDocument } from '@app/model/user/BaseUser'
import { NormalUser, NormalUserDocument } from '@app/model/user/User'
import { UserResponse } from '@app/types/response.types'

export abstract class UserMapper {
  public static baseUsertoDTO(user: BaseUserDocument): UserResponse {
    return {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      birthday: user.birthDate,
      gender: user.sex,
      languages: user.languages,
    }
  }

  public static userToDTO(user: NormalUserDocument): UserResponse {
    return {
      fullName: user.fullName,
      email: user.email,
      birthday: user.birthDate,
      gender: user.sex,
      languages: user.languages,
      workoutDays: user.trainingDays,
      experience: user.trainingExperience,
    }
  }
}
