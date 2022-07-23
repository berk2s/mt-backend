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

export interface SubscriptionPackageResponse {
  id: any
  packageName: string
  period: number
  likeLimit: number
  canSeePersonalTrainers: boolean
  createdAt: Date
}

export interface SubscriptionResponse {
  id: any
  userId: string
  packageId: string
  status: string
  startDate: Date
  endDate: Date
  createdAt: Date
}
