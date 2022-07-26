/**
 * @module app.model.user
 */

 import { Experience, WorkoutDays } from '@app/types/enums'
 import { Schema } from 'mongoose'
 import { BaseUser, BaseUserDocument, userSchemaOptions } from './BaseUser'

export interface AthleteUserDocument extends BaseUserDocument {
  trainingExperience: Experience
  trainingDays: WorkoutDays[]
  interaction: string[]
}

const athleteUserSchema = new Schema({
   trainingExperience: { type: String, required: true },
   trainingDays: { type: Array<String>, required: true },
   interaction: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Interaction',
    }
   ],
   interactedBy: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  ]
}, userSchemaOptions)
 

export const AthleteUser = BaseUser.discriminator<AthleteUserDocument>('ATHLETE', athleteUserSchema);
