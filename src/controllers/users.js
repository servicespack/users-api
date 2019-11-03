const bcrypt   = require('bcryptjs')
const doT      = require('dot')
const fs       = require('fs')
const mailer   = require('../helpers/mailer')
const mongoose = require('mongoose')
const validate = require('validate.js')

const User                 = mongoose.model('User')
const Verification         = mongoose.model('Verification')
const verificationTemplate = fs.readFileSync('src/templates/account-verification').toString('utf8')
const controllers          = {}

controllers.get = async (req, res) => {
  const query = {}
  const users = await User.find(query)

  return res.status(200).json(users)
}

controllers.getOne = async (req, res) => {
  const user = await User.findById(req.params.id)

  if (!user) {
    return res.status(404).json({
      'error': 'User not found'
    })
  }

  return res.status(200).json(user)
}

controllers.post = async (req, res) => {
  const data = {
    name: req.body.name,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password
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
    return res.status(400).json(validate(data, constraints))
  }

  const salt    = bcrypt.genSaltSync(10)
  data.password = bcrypt.hashSync(data.password, salt)

  const newUser = new User(data)
  newUser.save(async (err, user) => {
    if (err) {
      return res.status(400).json({ err })
    } else {
      res.status(201).json({
        success: 'User created'
      })

      const verification = new Verification({ email: user.email })
      await verification.save()

      const generatedHtml = doT.template(verificationTemplate)()
      await mailer.sendMail(user.email, 'Account Confirmation', generatedHtml)
      return
    }
  })
}

controllers.patch = async (req, res) => {
  const user = await User.findById(req.params.id)

  if (!user) {
    return res.status(404).json({
      'error': 'User not found'
    })
  }

  const data = {
    name: req.body.name,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password
  }

  const constraints = {
    email: {
      email: true
    }
  }

  const errors = validate(data, constraints)
  if (errors) {
    return res.status(400).json(errors)
  }


  user.name     = data.name     || user.name
  user.email    = data.email    || user.email
  user.username = data.username || user.username
  await user.save()

  return res.status(200).json(user)
}

controllers.put = (req, res) => {
  return res.status(503).json({
    error: 'Service Unavailable'
  })
}

controllers.delete = async (req, res) => {
  const user = await User.findById(req.params.id)

  if (!user) {
    return res.status(404).json({
      'error': 'User not found'
    })
  }

  await user.delete()
  return res.status(204).json({})
}

module.exports = controllers
