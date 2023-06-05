import { type NextFunction, type Request, type Response } from 'express'
import jwt from 'jsonwebtoken'

const { TOKEN_SECRET = 'abcdef' } = process.env

const auth = ({ onlyTheOwner = false } = {}) => async (request: Request, response: Response, next: NextFunction) => {
  const authorization = request.headers.authorization

  if (!authorization) {
    return response.status(401).json({
      error: 'No token provided'
    })
  }

  const [, token] = authorization.split(' ')

  try {
    const { sub } = jwt.verify(token, TOKEN_SECRET)

    const { id } = request.params

    if (onlyTheOwner && sub !== id) {
      return response.status(401).json({
        error: 'Only allowed to the owner'
      })
    }

    next()
  } catch (error) {
    return response.status(401).json({
      error
    })
  }
}

export default auth
