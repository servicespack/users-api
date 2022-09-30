import mongoose from 'mongoose'
import validate from 'validate.js'

const User = mongoose.model('User')

validate.validators.available = function (value, { field }) {
  return new validate.Promise(async function (resolve, reject) {
    const user = await User.findOne({ [field]: value })

    if (user) {
      resolve('not available')
    } else {
      resolve()
    }
  })
}

const validators = {}

validators.list = (request, response, next) => {
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
      type: 'string'
    }
  }

  const errors = validate(request.query, constraints)

  if (errors) {
    return response.status(400).json(errors)
  }

  next()
}

validators.create = async (request, response, next) => {
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
    await validate.async(request.body, constraints)
  } catch (errors) {
    return response.status(400).json(errors)
  }

  next()
}

validators.update = async (request, response, next) => {
  const constraints = {
    name: {
      length: {
        minimum: 3
      }
    },
    email: {
      email: true,
      available: {
        field: 'email'
      }
    },
    username: {
      length: {
        minimum: 3
      },
      available: {
        field: 'username'
      }
    }
  }

  try {
    await validate.async(request.body, constraints)
  } catch (errors) {
    return response.status(400).json(errors)
  }

  next()
}

validators.updatePassword = async (request, response, next) => {
  const constraints = {
    current_password: {
      presence: true,
      type: 'string'
    },
    new_password: {
      presence: true,
      type: 'string',
      length: {
        minimum: 8
      }
    }
  }

  try {
    await validate.async(request.body, constraints)
  } catch (errors) {
    return response.status(400).json(errors)
  }

  next()
}

export default validators
