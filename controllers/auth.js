const jwt      = require('jsonwebtoken')
const bcrypt   = require('bcryptjs')
const mongoose = require('mongoose')
const validate = require('validate.js')

const TOKEN_SECRET     = process.env.TOKEN_SECRET
const TOKEN_EXPIRATION = process.env.TOKEN_EXPIRATION
const User             = mongoose.model('User')
const controllers      = {}

controllers.post = async (req, res) => {
  const { username, password } = req.body

  const constraints = {
    username: {
      presence: true
    },
    password: {
      presence: true
    }
  }

  const errors = validate({username, password}, constraints)
  if (errors) {
    return res.status(400).json(errors)
  }

  const user = await User.findOne({ username }).select('+password')

  if (!user) {
    return res.status(400).json({ error: 'User not found' })
  }

  const correctPassword = await bcrypt.compare(password, user.password)
  if (!correctPassword) {
    return res.status(400).json({ error: 'Invalid password' })
  }

  const token = jwt.sign({ id: user.id }, TOKEN_SECRET, { expiresIn: TOKEN_EXPIRATION })
  return res.status(200).json({ token })
}

module.exports = controllers
