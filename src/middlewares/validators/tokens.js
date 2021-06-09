'use strict'

const validate = require('validate.js')

const validators = {}

validators.create = (request, response, next) => {
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

  const errors = validate(request.body, constraints)

  if (errors) {
    return response.status(400).json(errors)
  }

  next()
}

module.exports = validators
