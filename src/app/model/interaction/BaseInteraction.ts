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

export interface BaseInteractionDocument extends Document {
  _id?: ObjectId
  user: string
  toUser: string
  createdAt: string
  interactionType: 'LIKED' | 'DISLIKED'
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
  },
  baseInteractionOptions,
)

export const BaseInteraction: BaseInteractionModel = model<
  BaseInteractionDocument,
  BaseInteractionModel
>('Interaction', baseInteractionSchema)
