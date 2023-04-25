import { type NextFunction, type Request, type Response } from 'express'
import jwt from 'jsonwebtoken'
import { User } from '../entities/user'

import { orm } from '../start/database'

const { TOKEN_PREFIX, TOKEN_SECRET } = process.env
const userRepository = orm.em.getRepository(User)

const auth = ({ onlyTheOwner } = { onlyTheOwner: false }) => async (request: Request, response: Response, next: NextFunction) => {
  const authorization = request.headers.authorization

  if (!authorization) {
    return response.status(401).json({
      error: 'No token provided'
    })
  }

  const [prefix, token] = authorization.split(' ')

  if (prefix !== TOKEN_PREFIX) {
    return response.status(401).json({
      error: 'Invalid prefix'
    })
  }

  try {
    const { sub } = jwt.verify(token, TOKEN_SECRET as string)

    const user = await userRepository.findOne(sub as string)

    if (user == null) {
      return response.status(401).json({
        error: 'Token\'s user doesn\'t exist'
      })
    }

    const { id } = request.params

    if (onlyTheOwner && sub !== id) {
      return response.status(401).json({
        error: 'Only allowed to the owner'
      })
    }

    next(); return
  } catch (error) {
    return response.status(401).json({
      error
    })
  }
}

export default auth
