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

export interface GymDocument extends Document {
  _id?: ObjectId
  name: string
}

export interface GymModel extends Model<GymDocument> {}

export const gymOptions: SchemaOptions = {
  timestamps: true,
}

const gymSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  gymOptions,
)

export const Gym: GymModel = model<GymDocument, GymModel>('Gym', gymSchema)
