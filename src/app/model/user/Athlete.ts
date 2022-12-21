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
  interactedBy: []
  remaningLike: number;
  canSeePersonalTrainers: boolean
  isPremium: boolean
  location: any
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
      ref: 'User',
      default: []
    }
    ],
    remaningLike: {
      type: Number,
      required: false,
      default: 20
    }, 
    canSeePersonalTrainers: {
      type: Boolean,
      required: false,
      default: false
    },
    isPremium: {
      type: Boolean,
      required: false,
      default: false
    },
    location: {
      type: {
        type: String, 
        enum: ['Point'], 
        required: true
      },
      coordinates: {
        type: [Number],
        required: true,
      }
    }

}, userSchemaOptions)
 
athleteUserSchema.index({ location: '2dsphere' })

export const AthleteUser = BaseUser.discriminator<AthleteUserDocument>('ATHLETE', athleteUserSchema);

