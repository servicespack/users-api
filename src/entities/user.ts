import type { Document } from 'mongoose'
import mongoose, { Schema } from 'mongoose'

export interface IUser extends Document {
  name: string
  email: string
  emailVerificationKey: string
  isEmailVerified: boolean
  username: string
  password: string
  createdAt: Date
  updatedAt: Date
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    emailVerificationKey: { type: String, default: '' },
    isEmailVerified: { type: Boolean, default: false },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret: any) {
        ret.id = ret._id.toHexString()
        delete ret._id
        delete ret.__v
        delete ret.password
        delete ret.emailVerificationKey
        delete ret.createdAt
        delete ret.updatedAt
      },
    },
    toObject: {
      transform(_doc, ret: any) {
        ret.id = ret._id.toHexString()
        delete ret._id
        delete ret.__v
      },
    },
  },
)

userSchema.index({ name: 'text', email: 'text', username: 'text' })

export const User = mongoose.model<IUser>('User', userSchema)

export const userValidationRules = {
  $jsonSchema: {
    bsonType: 'object',
    required: ['name', 'email', 'username', 'password'],
    properties: {
      name: { bsonType: 'string', description: 'must be a string and is required' },
      email: { bsonType: 'string', description: 'must be a string and is required' },
      emailVerificationKey: { bsonType: 'string' },
      isEmailVerified: { bsonType: 'bool' },
      username: { bsonType: 'string', description: 'must be a string and is required' },
      password: { bsonType: 'string', description: 'must be a string and is required' },
    },
  },
}
