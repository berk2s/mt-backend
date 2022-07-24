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

export interface MessageDocument extends Document {
  _id?: ObjectId
  sender: string
  content: string
  chat: string
  createdAt: Date
}

export interface MessageModel extends Model<MessageDocument> {}

export const messageOptions: SchemaOptions = {
  timestamps: true,
}

const messageSchema = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    chat: {
      type: Schema.Types.ObjectId,
      ref: 'Chat',
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  messageOptions,
)

export const Message: MessageModel = model<MessageDocument, MessageModel>(
  'Message',
  messageSchema,
)
