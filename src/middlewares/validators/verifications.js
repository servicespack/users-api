import validate from 'validate.js'

const validators = {}

validators.create = (request, response, next) => {
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

  const errors = validate(request.body, constraints)

  if (errors) {
    return response.status(400).json(errors)
  }

  next()
}

export default validators
