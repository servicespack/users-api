import { type NextFunction, type Request, type Response } from 'express'
import validate from 'validate.js'

export default {
  list: async (request: Request, response: Response, next: NextFunction) => {
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
  },
  create: async (request: Request, response: Response, next: NextFunction) => {
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

    try {
      await validate.async(request.body, constraints)
    } catch (errors) {
      return response.status(400).json(errors)
    }

    next()
  },
  update: async (request: Request, response: Response, next: NextFunction) => {
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

    try {
      await validate.async(request.body, constraints)
    } catch (errors) {
      return response.status(400).json(errors)
    }

    next()
  },
  updatePassword: async (request: Request, response: Response, next: NextFunction) => {
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
}
