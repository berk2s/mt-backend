/**
 * @module app.model.user
 */

import { Gender } from '@app/types/enums'
import { HashUtility } from '@app/utilities/hash-utility'
import { Document, ObjectId, Schema, Model, model, SchemaOptions } from 'mongoose'

/**
 * All user types such as User and PT extend this interface
 */
export interface BaseUserDocument extends Document {
  _id?: ObjectId
  fullName: string
  imageUrl: string
  email: string
  passwordHash: string
  birthDate: Date
  sex: Gender
  languages: string[]
}

export interface BaseUserModel extends Model<BaseUserDocument> {}

export const userSchemaOptions: SchemaOptions = {
  discriminatorKey: "userType"
}

const baseUserSchema = new Schema({
    fullName: { type: String, required: true },
    imageUrl: { type: String, required: false },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    birthDate: { type: Date, required: true },
    sex: { type: String, required: true },
    languages: { type: Array<String>, required: true}
}, userSchemaOptions)

export const BaseUser: BaseUserModel = model<BaseUserDocument, BaseUserModel>('User', baseUserSchema);

/**
 * Hashes the password before saving it
 */
baseUserSchema.pre("save", async function (next) {
  const user = this

  if (this.isModified("passwordHash") || this.isNew) {
    user.passwordHash = await HashUtility.hash(user.passwordHash);
  } else {
    return next()
  }
})
