import { BodyDTO } from '@app/types/controller.types'
import { Experience, WorkoutDays } from '@app/types/enums'
import { Gender } from '@app/types/enums'
import { Expose } from 'class-transformer'
import {
  IsDateString,
  IsDefined,
  IsEmail,
  IsEnum,
  Length,
  Validate,
} from 'class-validator'
import { ObjectIdValidator } from '@app/validation/ObjectIdValidator'

/**
 * Register User DTO
 */
export class RegisterAthleteRequest extends BodyDTO {
  @IsDefined({
    message: 'fullName.empty',
  })
  @Length(1, 100, {
    message: 'fullName.invalid',
  })
  @Expose()
  fullName?: string

  @IsDefined({
    message: 'email.empty',
  })
  @IsEmail(
    {},
    {
      message: 'email.invalid',
    },
  )
  @Expose()
  email?: string

  @IsDefined({
    message: 'password.empty',
  })
  @Length(6, 100, {
    message: 'password.invalid',
  })
  @Expose()
  password?: string

  @IsDefined({
    message: 'birthday.empty',
  })
  @IsDateString(
    {},
    {
      message: 'birthday.invalid',
    },
  )
  @Expose()
  birthday?: Date

  @IsDefined({
    message: 'gender.empty',
  })
  @IsEnum(Gender, {
    message: 'gender.invalid',
  })
  @Expose()
  gender?: Gender

  @IsDefined({
    message: 'language.empty',
  })
  @Expose()
  languages?: string[]

  @IsDefined({
    message: 'trainingDays.empty',
  })
  @IsEnum(WorkoutDays, {
    message: 'trainingDays.invalid',
    each: true,
  })
  @Expose()
  trainingDays?: WorkoutDays[]

  @IsDefined({
    message: 'trainingExperience.empty',
  })
  @IsEnum(Experience, {
    message: 'trainingExperience.invalid',
  })
  @Expose()
  trainingExperience?: Experience
}

export class LikeAthleteRequest extends BodyDTO {
  @IsDefined({
    message: 'userId.empty',
  })
  @Validate(ObjectIdValidator, {
    message: 'userId.invalid',
  })
  @Expose()
  likedUserId: string
}

export class DislikeAthleteRequest extends BodyDTO {
  @IsDefined({
    message: 'userId.empty',
  })
  @Validate(ObjectIdValidator, {
    message: 'userId.invalid',
  })
  @Expose()
  dislikedUserId: string
}

export interface InteractionResponse {
  id?: any
  userId: string
  toUserId: string
  interactionType: 'LIKED' | 'DISLIKED'
  createdAt: Date
}

export interface LikeAthleteResponse extends InteractionResponse {
  matching: any
}
export interface DislikeAthleteResponse extends InteractionResponse {
  dislikeEndDate: Date
}

export class UnlinkMatchingRequest extends BodyDTO {}

/**
 * Register User DTO
 */
export class UpdateAthleteRequest extends BodyDTO {
  @IsDefined({
    message: 'fullName.empty',
  })
  @Length(1, 100, {
    message: 'fullName.invalid',
  })
  @Expose()
  fullName?: string

  @IsDefined({
    message: 'email.empty',
  })
  @IsEmail(
    {},
    {
      message: 'email.invalid',
    },
  )
  @Expose()
  email?: string

  @IsDefined({
    message: 'birthday.empty',
  })
  @IsDateString(
    {},
    {
      message: 'birthday.invalid',
    },
  )
  @Expose()
  birthday?: Date

  @IsDefined({
    message: 'gender.empty',
  })
  @IsEnum(Gender, {
    message: 'gender.invalid',
  })
  @Expose()
  gender?: Gender

  @IsDefined({
    message: 'language.empty',
  })
  @Expose()
  languages?: string[]

  @IsDefined({
    message: 'trainingDays.empty',
  })
  @IsEnum(WorkoutDays, {
    message: 'trainingDays.invalid',
    each: true,
  })
  @Expose()
  trainingDays?: WorkoutDays[]

  @IsDefined({
    message: 'trainingExperience.empty',
  })
  @IsEnum(Experience, {
    message: 'trainingExperience.invalid',
  })
  @Expose()
  trainingExperience?: Experience
}
