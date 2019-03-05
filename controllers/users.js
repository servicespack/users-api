const bcrypt   = require('bcryptjs')
const mongoose = require('mongoose')
const validate = require('validate.js')

const User       = mongoose.model('User')
const controller = {}

controller.get = (req, res) => {
  console.log('GET /users')

  const query = {}

  User.find(query, (err, users) => {
    if (err) {
      res.status(400)
      res.json({ err })
    } else {
      res.status(200)
      res.json(users)
    }
  })
}

controller.post = async (req, res) => {
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
      res.status(400)
      res.json({ err })
    } else {
      return res.status(201).json(user)
    }
  })
}

module.exports = controller
