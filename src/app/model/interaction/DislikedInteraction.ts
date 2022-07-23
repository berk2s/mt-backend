/**
 * @module app.model.interaction
 */

import { Schema } from 'mongoose'
import {
  BaseInteraction,
  BaseInteractionDocument,
  baseInteractionOptions,
} from './BaseInteraction'

export interface DislikedInteractionDocument extends BaseInteractionDocument {
  dislikeEndDate: Date
}

const likedInteractionSchema = new Schema(
  {
    dislikeEndDate: {
      type: Date,
      required: true,
    },
  },
  baseInteractionOptions,
)

export const DislikedInteraction = BaseInteraction.discriminator<
  DislikedInteractionDocument
>('DISLIKED', likedInteractionSchema)
