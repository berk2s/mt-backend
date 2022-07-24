/**
 * @module app.mappers
 */

import { BaseUserDocument } from '@app/model/user/BaseUser'
import { AthleteUserDocument } from '@app/model/user/Athlete'
import { AthleteResponse, UserResponse } from '@app/types/response.types'

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
      gym: user.gym,
    }
  }

  public static athleteToDTO(user: AthleteUserDocument): AthleteResponse {
    return {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      imageUrl: user.imageUrl,
      birthday: user.birthDate,
      gender: user.sex,
      languages: user.languages,
      workoutDays: user.trainingDays,
      gym: user.gym,
      trainingExperience: user.trainingExperience,
      trainingDays: user.trainingDays,
    }
  }
}
