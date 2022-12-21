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
  packageDescription: string
  // -1 stands for unlimited
  period: string
  price: number
  currency: string
  packageType: string
  foreginProductId: string
  foreginPriceId: string
  foreginRef: string
  createdAt: Date
}

export interface SubscriptionPackageModel
  extends Model<SubscriptionPackageDocument> {}

export const subscriptionPackageOptions: SchemaOptions = {
  discriminatorKey: 'packageType',
  timestamps: true,
}

const subscriptionPackageSchema = new Schema(
  {
    packageName: {
      type: String,
      required: true,
    },
    packageDescription: {
      type: String,
      required: true,
    },
    period: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
    foreginProductId: {
      type: String,
      required: true,
    },
    foreginPriceId: {
      type: String,
      required: true,
    },
    foreginRef: {
      type: String,
      required: true,
    },
  },
  subscriptionPackageOptions,
)

export const SubscriptionPackage: SubscriptionPackageModel = model<
  SubscriptionPackageDocument,
  SubscriptionPackageModel
>('SubscriptionPackage', subscriptionPackageSchema)
