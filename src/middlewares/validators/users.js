const mongoose = require('mongoose')
const validate = require('validate.js')

const User = mongoose.model('User')

validate.validators.available = function (value, { field }) {
  return new validate.Promise(async function (resolve, reject) {
    const user = await User.findOne({ [field]: value })

    if (user) {
      resolve(`not available`)
    } else {
      resolve()
    }
  })
}

const validators = {}

validators.list = (request, response, next) => {
  const { page, size, search } = request.query

  const data = {
    page,
    size,
    search
  }

  const constraints = {
    page: {
      numericality: {
        onlyInteger: true,
        greaterThan: 0
      }
    },
    size: {
      numericality: {
        onlyInteger: true,
        greaterThan: 0
      }
    },
    search: {
    }
  }

  const errors = validate(data, constraints)

  if (errors) {
    return response.status(400).json(errors)
  }

  next()
}

validators.create = async (request, response, next) => {
  const { name, email, username, password } = request.body

  const data = {
    name,
    email,
    username,
    password
  }

  const constraints = {
    name: {
      presence: true,
      length: {
        minimum: 3
      }
    },
    email: {
      presence: true,
      email: true,
      available: {
        field: 'email'
      }
    },
    username: {
      presence: true,
      length: {
        minimum: 3
      },
      available: {
        field: 'username'
      }
    },
    password: {
      presence: true,
      length: {
        minimum: 8
      }
    }
  }

  try {
    await validate.async(data, constraints)
  } catch (errors) {
    return response.status(400).json(errors)
  }

  next()
}

validators.update = async (request, response, next) => {
  const { name, email, username } = request.body

  const data = {
    name,
    email,
    username
  }

  const constraints = {
    name: {
      length: {
        minimum: 3
      }
    },
    email: {
      email: true
    },
    username: {
      length: {
        minimum: 3
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
