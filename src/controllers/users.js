const bcrypt = require('bcryptjs')
const doT = require('dot')
const fs = require('fs')
const mailer = require('../helpers/mailer')
const mongoose = require('mongoose')
const validate = require('validate.js')

const User = mongoose.model('User')
const Verification = mongoose.model('Verification')
const verificationTemplate = fs.readFileSync('src/templates/account-verification').toString('utf8')
const controllers = {}

controllers.get = async (_, response) => {
  const query = {}
  const users = await User.find(query)

  return response.status(200).json(users)
}

controllers.getOne = async (request, response) => {
  const user = await User.findById(request.params.id)

  if (!user) {
    return response.status(404).json({
      'error': 'User not found'
    })
  }

  return response.status(200).json(user)
}

controllers.post = async (request, response) => {
  const data = {
    name: request.body.name,
    email: request.body.email,
    username: request.body.username,
    password: request.body.password
  }

  const constraints = {
    name: {
      presence: true
    },
    email: {
      presence: true,
      email: true
    },
    username: {
      presence: true
    },
    password: {
      presence: true,
      length: {
        minimum: 8
      }
    }
  }

  const errors = validate(data, constraints)
  if (errors) {
    return response.status(400).json(validate(data, constraints))
  }

  const salt = bcrypt.genSaltSync(10)
  data.password = bcrypt.hashSync(data.password, salt)

  const newUser = new User(data)

  try {
    const user = await newUser.save()

    response.status(201).json({
      success: 'User created'
    })

    const verification = new Verification({ email: user.email })
    await verification.save()

    const generatedHtml = doT.template(verificationTemplate)()
    await mailer.sendMail(user.email, 'Account Confirmation', generatedHtml)
  } catch (error) {
    return response.status(400).json({ error })
  }
}

controllers.patch = async (request, response) => {
  const user = await User.findById(request.params.id)

  if (!user) {
    return response.status(404).json({
      'error': 'User not found'
    })
  }

  const data = {
    name: request.body.name,
    email: request.body.email,
    username: request.body.username,
    password: request.body.password
  }

  const constraints = {
    email: {
      email: true
    }
  }

  const errors = validate(data, constraints)
  if (errors) {
    return response.status(400).json(errors)
  }

  user.name = data.name || user.name
  user.email = data.email || user.email
  user.username = data.username || user.username
  await user.save()

  return response.status(200).json(user)
}

controllers.put = (_, response) => {
  return response.status(503).json({
    error: 'Service Unavailable'
  })
}

controllers.delete = async (request, response) => {
  const user = await User.findById(request.params.id)

  if (!user) {
    return response.status(404).json({
      'error': 'User not found'
    })
  }

  await user.delete()
  return response.status(204).json({})
}

module.exports = controllers
