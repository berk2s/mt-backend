/**
 * @module app.model.interaction
 */

import {
  Document,
  ObjectId,
  Schema,
  Model,
  model,
  SchemaOptions,
} from 'mongoose'

/**
 * Base document for liked and disliked interactions
 */
export interface BaseInteractionDocument extends Document {
  _id?: ObjectId
  user: string
  toUser: string
  interactionType: 'LIKED' | 'DISLIKED'
  status: 'ACTIVE' | 'CLOSED'
  createdAt: Date
}

export interface BaseInteractionModel extends Model<BaseInteractionDocument> {}

export const baseInteractionOptions: SchemaOptions = {
  discriminatorKey: 'interactionType',
  timestamps: true,
}

const baseInteractionSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    toUser: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    status: {
      type: String,
      required: false,
    },
  },
  baseInteractionOptions,
)

export const BaseInteraction: BaseInteractionModel = model<
  BaseInteractionDocument,
  BaseInteractionModel
>('Interaction', baseInteractionSchema)

baseInteractionSchema.pre('save', async function (next) {
  const user = this
  user.status = 'ACTIVE'
})
