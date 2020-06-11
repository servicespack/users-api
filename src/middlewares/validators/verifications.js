'use strict'

const validate = require('validate.js')

const validators = {}

validators.create = (request, response, next) => {
  const { user_id: userId, type, key } = request.body

  const data = {
    'user_id': userId,
    type,
    key
  }

  const constraints = {
    user_id: {
      presence: true
    },
    type: {
      presence: true,
      inclusion: ['email']
    },
    key: {
      presence: true
    }
  }

  const errors = validate(data, constraints)

  if (errors) {
    return response.status(400).json(errors)
  }

  next()
}

module.exports = validators
