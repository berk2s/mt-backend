/**
 * @module app.model.user
 */

import { Schema } from 'mongoose'
import { BaseUser, BaseUserDocument, userSchemaOptions } from './BaseUser'

export interface PersonalTrainerDocument extends BaseUserDocument {
  yearsOfExperience: number
  certificates: string[]
  iban: string
}

const personalTrainerUserSchema = new Schema(
  {
    yearsOfExperience: {
      type: String,
      required: true,
    },
    certificates: { type: String, required: false },
    iban: { type: String, required: true },
  },
  userSchemaOptions,
)

export const PersonalTrainerUser = BaseUser.discriminator<
  PersonalTrainerDocument
>('PT', personalTrainerUserSchema)
