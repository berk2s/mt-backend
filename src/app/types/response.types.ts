import { BaseUserDocument } from '@app/model/user/BaseUser'
import { Experience, Gender, WorkoutDays } from './enums'

/**
 * User response
 */
export interface UserResponse {
  id?: any
  fullName?: string
  email?: string
  birthday?: Date
  gender?: Gender
  languages?: string[]
  workoutDays?: WorkoutDays[]
  experience?: Experience
}
