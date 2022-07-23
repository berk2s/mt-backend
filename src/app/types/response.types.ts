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
  imageUrl?: string
}

export interface MatchingResponse {
  id: any
  interactedUserId: string
  interactingUserId: string
  status: 'ACTIVE' | 'CLOSED'
  createdAt: Date
}
