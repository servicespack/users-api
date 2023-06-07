import { type NextFunction, type Request, type Response } from 'express'
import validate from 'validate.js'

export default {
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
