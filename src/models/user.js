'use strict'

const mongoose = require('mongoose')
const mongooseDelete = require('mongoose-delete')

const DB_SOFT_DELETE = process.env.DB_SOFT_DELETE === 'true'

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    text: true
  },
  email: {
    type: String,
    lowercase: true,
    required: true,
    unique: true
  },
  email_verification_key: {
    type: String,
    select: false
  },
  is_email_verified: {
    type: Boolean,
    required: true,
    default: false
  },
  username: {
    type: String,
    lowercase: true,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  created_at: {
    type: Date,
    select: false
  },
  updated_at: {
    type: Date,
    select: false
  }
})

DB_SOFT_DELETE && userSchema.plugin(mongooseDelete)

userSchema.pre('save', function (next) {
  const now = new Date()

  if (!this.created_at) this.created_at = now

  this.updated_at = now

  next()
})

const User = mongoose.model('User', userSchema)
module.exports = User
