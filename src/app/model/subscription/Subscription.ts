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

export interface SubscriptionDocument extends Document {
  _id?: ObjectId
  user: string
  package: string
  status: 'ACTIVE' | 'INACTIVE'
  startDate: Date
  endDate: Date
  createdAt: Date
}

export interface SubscriptionModel extends Model<SubscriptionDocument> {}

export const subscriptionOptions: SchemaOptions = {
  timestamps: true,
}

const subscriptionSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    package: {
      type: Schema.Types.ObjectId,
      ref: 'Package',
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    startDate: {
      type: Schema.Types.Date,
      required: true,
    },
    endDate: {
      type: Schema.Types.Date,
    },
  },
  subscriptionOptions,
)

export const Subscription: SubscriptionModel = model<
  SubscriptionDocument,
  SubscriptionModel
>('Subscription', subscriptionSchema)
