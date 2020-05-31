const validate = require('validate.js')

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

validators.create = (request, response, next) => {
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
      email: true
    },
    username: {
      presence: true,
      length: {
        minimum: 3
      }
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
    return response.status(400).json(errors)
  }

  next()
}

validators.update = (request, response, next) => {
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
