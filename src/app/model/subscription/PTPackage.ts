/**
 * @module app.model.subscription
 */

import { Schema } from 'mongoose'
import {
  SubscriptionPackage,
  SubscriptionPackageDocument,
  subscriptionPackageOptions,
} from './Package'

export interface PTPackageDocument extends SubscriptionPackageDocument {
    workoutType: string[]
    personalTrainer: string
}

const ptPackageSchema = new Schema(
  {
    workoutType: {
        type: Array<String>,
        required: true
    },
    personalTrainer: {
      type: String,
      ref: 'user'
    }
  },
  subscriptionPackageOptions,
)

export const PTPackage = SubscriptionPackage.discriminator<
  PTPackageDocument
>('PT_PACKAGE', ptPackageSchema)
