'use strict'

const validate = require('validate.js')

const validators = {}

validators.create = (request, response, next) => {
  const { username, password } = request.body

  const data = {
    username,
    password
  }

  const constraints = {
    username: {
      presence: true,
      length: {
        minimum: 1
      }
    },
    password: {
      presence: true,
      length: {
        minimum: 1
      }
    }
  }

  const errors = validate(data, constraints)

  if (errors) {
    return response.status(400).json(errors)
  }

  next()
}

module.exports = validators
