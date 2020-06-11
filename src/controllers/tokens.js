'use strict'

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const validate = require('validate.js')

const {
  APP_URL,
  TOKEN_PREFIX,
  TOKEN_SECRET,
  TOKEN_EXPIRATION
} = process.env

const User = mongoose.model('User')
const controllers = {}

controllers.post = async (request, response) => {
  const { username, password } = request.body

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
    return response.status(400).json(errors)
  }

  const user = await User.findOne({ username }).select('+password')

  if (!user) {
    return response.status(404).json({ error: 'User not found' })
  }

  const correctPassword = await bcrypt.compare(password, user.password)
  if (!correctPassword) {
    return response.status(401).json({ error: 'Invalid password' })
  }

  const payload = {
    iss: APP_URL,
    sub: user.id
  }

  const token = jwt.sign(payload, TOKEN_SECRET, { expiresIn: TOKEN_EXPIRATION * 60 })

  return response.status(201).json({
    Authorization: `${TOKEN_PREFIX} ${token}`
  })
}

module.exports = controllers
