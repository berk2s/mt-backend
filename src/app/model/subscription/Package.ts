/**
 * @module app.model.subscription
 */

import {
  Document,
  ObjectId,
  Schema,
  Model,
  model,
  SchemaOptions,
} from 'mongoose'

export interface SubscriptionPackageDocument extends Document {
  _id?: ObjectId
  packageName: string
  period: number
  // -1 stands for unlimited
  likeLimit: number
  canSeePersonalTrainers: boolean
  createdAt: Date
}

export interface SubscriptionPackageModel
  extends Model<SubscriptionPackageDocument> {}

export const subscriptionPackageOptions: SchemaOptions = {
  timestamps: true,
}

const subscriptionPackageSchema = new Schema(
  {
    packageName: {
      type: String,
      required: true,
    },
    likeLimit: {
      type: Number,
      required: true,
    },
    canSeePersonalTrainers: {
      type: Boolean,
      required: true,
    },
    period: {
      type: Number,
      required: true,
    },
  },
  subscriptionPackageOptions,
)

export const SubscriptionPackage: SubscriptionPackageModel = model<
  SubscriptionPackageDocument,
  SubscriptionPackageModel
>('SubscriptionPackage', subscriptionPackageSchema)
