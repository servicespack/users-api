import { type NextFunction, type Request, type Response } from 'express'
import validate from 'validate.js'

export default {
  create: (request: Request, response: Response, next: NextFunction) => {
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
}
