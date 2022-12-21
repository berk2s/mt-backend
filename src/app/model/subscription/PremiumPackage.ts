/**
 * @module app.model.subscription
 */

import { Schema } from 'mongoose'
import {
  SubscriptionPackage,
  SubscriptionPackageDocument,
  subscriptionPackageOptions,
} from './Package'

export interface PremiumPackageDocument extends SubscriptionPackageDocument {
  likeLimit: number
  canSeePersonalTrainers: boolean
}

const premiumPackageSchema = new Schema(
  {
    likeLimit: {
      type: Number,
      required: true,
    },
    canSeePersonalTrainers: {
      type: Boolean,
      required: true,
    },
  },
  subscriptionPackageOptions,
)

export const PremiumPackage = SubscriptionPackage.discriminator<
  PremiumPackageDocument
>('PREMIUM_PACKAGE', premiumPackageSchema)
