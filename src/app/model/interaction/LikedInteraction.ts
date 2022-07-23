/**
 * @module app.model.interaction
 */

import { Schema } from 'mongoose'
import {
  BaseInteraction,
  BaseInteractionDocument,
  baseInteractionOptions,
} from './BaseInteraction'

export interface LikedInteractionDocument extends BaseInteractionDocument {
  matching?: string
}

const likedInteractionSchema = new Schema(
  {
    matching: {
      type: Schema.Types.ObjectId,
      ref: 'Matching',
    },
  },
  baseInteractionOptions,
)

export const LikedInteraction = BaseInteraction.discriminator<
  LikedInteractionDocument
>('LIKED', likedInteractionSchema)
