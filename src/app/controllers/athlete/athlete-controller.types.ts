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
} from 'class-validator'

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
