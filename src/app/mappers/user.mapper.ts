/**
 * @module app.mappers
 */

import { BaseUserDocument } from '@app/model/user/BaseUser'
import { AthleteUser, AthleteUserDocument } from '@app/model/user/Athlete'
import { UserResponse } from '@app/types/response.types'

export abstract class UserMapper {
  public static baseUsertoDTO(user: BaseUserDocument): UserResponse {
    return {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      imageUrl: user.imageUrl,
      birthday: user.birthDate,
      gender: user.sex,
      languages: user.languages,
    }
  }

  public static userToDTO(user: AthleteUserDocument): UserResponse {
    return {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      imageUrl: user.imageUrl,
      birthday: user.birthDate,
      gender: user.sex,
      languages: user.languages,
      workoutDays: user.trainingDays,
      experience: user.trainingExperience,
    }
  }
}
