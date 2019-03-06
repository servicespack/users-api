const bcrypt   = require('bcryptjs')
const mongoose = require('mongoose')
const validate = require('validate.js')

const User        = mongoose.model('User')
const controllers = {}

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
  newUser.save((err, user) => {
    if (err) {
      return res.status(400).json({ err })
    } else {
      return res.status(201).json(user)
    }
  })
}

controllers.put = (req, res) => {
  return res.status(503).json({
    error: 'Service Unavailable'
  })
}

controllers.patch = (req, res) => {
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
