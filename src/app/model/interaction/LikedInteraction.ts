/**
 * @module app.model.interaction
 */

import { Schema } from 'mongoose'
import {
  BaseInteraction,
  BaseInteractionDocument,
  baseInteractionOptions,
} from './BaseInteraction'

export interface LikedInteractionDocument extends BaseInteractionDocument {}

const likedInteractionSchema = new Schema({}, baseInteractionOptions)

export const LikedInteraction = BaseInteraction.discriminator<
  LikedInteractionDocument
>('LIKED', likedInteractionSchema)
