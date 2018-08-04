const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  birthday: {
    type: Date,
    required: true
  },
  private: {
    type: Boolean,
    default: false
  },
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  createdAt: {
    type: Date,
    default: Date()
  }
})

const User = mongoose.model('User', userSchema)
module.exports = User
