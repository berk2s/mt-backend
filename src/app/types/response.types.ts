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
  chatId: string
  createdAt: Date
}

export interface SubscriptionPackageResponse {
  id: any
  packageName: string
  packageDescription: string
  period: string
  price: number
  currency: string
  packageType: string
  foreginProductId: string
  foreginPriceId: string
  foreginRef: string
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

export interface CreatedSessionResponse {
  sessionUrl: string
}

export interface PremiumPackageResponse extends SubscriptionPackageResponse {
  likeLimit: number
  canSeePersonalTrainers: boolean
}

export interface ChatResponse {
  id: any
  participantIds: string[]
  messageIds: string[]
  status: 'ACTIVE' | 'CLOSED'
  createdAt: any
  updatedAt: any
}

export interface MessageResponse {
  id: any
  senderId: string
  chatId: string
  content: string
  createdAt: any
}
