/**
 * @module app.model.matching
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
 * interactedUser is the Athlete that liked first
 * interactingUser is the Athlete that liked last
 */
export interface MatchingDocument extends Document {
  _id?: ObjectId
  interactedUser: string
  interactingUser: string
  status: 'ACTIVE' | 'CLOSED'
  createdAt: Date
}

export interface MatchingModel extends Model<MatchingDocument> {}

export const matchingOptions: SchemaOptions = {
  timestamps: true,
}

const matchingSchema = new Schema(
  {
    interactedUser: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    interactingUser: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    status: {
      type: String,
      required: true,
    },
  },
  matchingOptions,
)

export const Matching: MatchingModel = model<MatchingDocument, MatchingModel>(
  'Matching',
  matchingSchema,
)

/**
 * Initially sets status to ACTIVE
 */
matchingSchema.pre('save', function (next) {
  const user = this
  user.status = 'ACTIVE'
})
