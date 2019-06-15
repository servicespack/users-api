const mongoose = require('mongoose')
const uuidv4   = require('uuid/v4')

const verificationSchema = mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  token: {
    type: String,
    required: true,
    unique: true,
    default: uuidv4()
  },
  created_at: {
    type: Date,
    required: true,
    default: Date()
  },
  updated_at: {
    type: Date,
    required: true,
    default: Date()
  }
})

const Verification = mongoose.model('Verification', verificationSchema)
module.exports     = Verification