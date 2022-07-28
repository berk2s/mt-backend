import { BodyDTO } from '@app/types/controller.types'
import { Gender } from '@app/types/enums'
import { Expose } from 'class-transformer'
import {
  IsDateString,
  IsDefined,
  IsEmail,
  IsEnum,
  Length,
  Max,
  Min,
} from 'class-validator'
import { RegisterUserRequest } from '../athlete/athlete-controller.types'

export class RegisterPersonalTrainer extends RegisterUserRequest {
  @IsDefined({
    message: 'yearsOfExperience.empty',
  })
  @Min(1, {
    message: 'yearsOfExperience.invalid',
  })
  @Expose()
  yearsOfExperience: number

  @IsDefined({
    message: 'gym.empty',
  })
  @Expose()
  gym: string

  @IsDefined({
    message: 'iban.empty',
  })
  @Expose()
  iban: string
}

export interface AddCertificateImagesRequest extends BodyDTO {
  files: any
}

export class CreatePTPackageRequest extends BodyDTO {
  @IsDefined({
    message: 'packageName.empty',
  })
  @Length(1, 100, {
    message: 'packageName.invalid',
  })
  @Expose()
  packageName: string

  @IsDefined({
    message: 'packageDescription.empty',
  })
  @Length(1, 100, {
    message: 'packageDescription.invalid',
  })
  @Expose()
  packageDescription: string

  @IsDefined({
    message: 'productPrice.empty',
  })
  @Min(1, {
    message: 'productPrice.invalid',
  })
  @Expose()
  unitAmonut: number

  @IsDefined({
    message: 'currency.empty',
  })
  @Expose()
  currency: string

  @IsDefined({
    message: 'subscriptionInterval.empty',
  })
  @Expose()
  subscriptionInterval: string

  @IsDefined({
    message: 'workoutType.empty',
  })
  @Expose()
  workoutType: string[]
}

export class PTInfoRequest extends BodyDTO {}

export class UpdatePTPackageRequest extends BodyDTO {
  @IsDefined({
    message: 'packageName.empty',
  })
  @Length(1, 100, {
    message: 'packageName.invalid',
  })
  @Expose()
  packageName: string

  @IsDefined({
    message: 'packageDescription.empty',
  })
  @Length(1, 100, {
    message: 'packageDescription.invalid',
  })
  @Expose()
  packageDescription: string

  @IsDefined({
    message: 'productPrice.empty',
  })
  @Min(1, {
    message: 'productPrice.invalid',
  })
  @Expose()
  unitAmonut: number

  @IsDefined({
    message: 'currency.empty',
  })
  @Expose()
  currency: string

  @IsDefined({
    message: 'subscriptionInterval.empty',
  })
  @Expose()
  subscriptionInterval: string

  @IsDefined({
    message: 'workoutType.empty',
  })
  @Expose()
  workoutType: string[]
}

export class PTListRequest extends BodyDTO {}

export class UpdatePTRequest extends BodyDTO {
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
    message: 'yearsOfExperience.empty',
  })
  @Min(1, {
    message: 'yearsOfExperience.invalid',
  })
  @Expose()
  yearsOfExperience: number

  @IsDefined({
    message: 'gym.empty',
  })
  @Expose()
  gym: string

  @IsDefined({
    message: 'iban.empty',
  })
  @Expose()
  iban: string

  @IsDefined({
    message: 'deletedCerdImages.empty',
  })
  @Expose()
  deletedCerfImages: string[]
}

export class MyPackagesRequest extends BodyDTO {}
