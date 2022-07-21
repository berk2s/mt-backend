/**
 * @module app.model.user
 */

 import { Experience, WorkoutDays } from '@app/types/enums'
 import { Schema } from 'mongoose'
 import { BaseUser, BaseUserDocument, userSchemaOptions } from './BaseUser'

export interface AthleteUserDocument extends BaseUserDocument {
  trainingExperience: Experience
  trainingDays: WorkoutDays[]
}

const athleteUserSchema = new Schema({
   trainingExperience: { type: Array<String>, required: true },
   trainingDays: { type: Array<String>, required: true}
}, userSchemaOptions)
 

export const AthleteUser = BaseUser.discriminator<AthleteUserDocument>('ATHLETE', athleteUserSchema);
