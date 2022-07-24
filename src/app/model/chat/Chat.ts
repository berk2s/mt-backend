/**
 * @module app.model.chat
 */

import {
  Document,
  ObjectId,
  Schema,
  Model,
  model,
  SchemaOptions,
} from 'mongoose'

export interface ChatDocument extends Document {
  _id?: ObjectId
  participants: string[]
  messages: string[]
  status: 'ACTIVE' | 'CLOSED'
  createdAt: Date
  updatedAt: Date
}

export interface ChatModel extends Model<ChatDocument> {}

export const chatOptions: SchemaOptions = {
  timestamps: true,
}

const chatSchema = new Schema(
  {
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],
    messages: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Message',
        required: true,
      },
    ],
    status: {
      type: String,
      required: true,
    },
  },
  chatOptions,
)

export const Chat: ChatModel = model<ChatDocument, ChatModel>(
  'Chat',
  chatSchema,
)
