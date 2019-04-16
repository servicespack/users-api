const mongoose = require('mongoose')

const verificationSchema = mongoose.Schema({
  email: {
    type: String,
    required: true
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