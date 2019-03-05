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
  username: {
    type: String,
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
    default: Date()
  },
  updated_at: {
    type: Date,
    default: Date()
  }
})

const User     = mongoose.model('User', userSchema)
module.exports = User
