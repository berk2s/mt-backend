/**
 * @module app.model.user
 */

 import { Experience, WorkoutDays } from '@app/types/enums'
 import { Schema } from 'mongoose'
 import { BaseUser, BaseUserDocument, userSchemaOptions } from './BaseUser'

export interface NormalUserDocument extends BaseUserDocument {
  trainingExperience: Experience
  trainingDays: WorkoutDays[]
}

const normalUserSchema = new Schema({
   trainingExperience: { type: Array<String>, required: true },
   trainingDays: { type: Array<String>, required: true}
}, userSchemaOptions)
 

export const NormalUser = BaseUser.discriminator<NormalUserDocument>('NORMAL_USER', normalUserSchema);
