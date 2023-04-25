import bcrypt from 'bcryptjs'
import { type Request, type Response } from 'express'
import jwt from 'jsonwebtoken'
import validate from 'validate.js'

import { User } from '../entities/user'
import { orm } from '../start/database'

const {
  APP_URL,
  TOKEN_PREFIX,
  TOKEN_SECRET,
  TOKEN_EXPIRATION
} = process.env

const userRepository = orm.em.getRepository(User)

export default {
  create: async (request: Request, response: Response) => {
    const { username, password } = request.body

    const constraints = {
      username: {
        presence: true
      },
      password: {
        presence: true
      }
    }

    const errors = validate({ username, password }, constraints)
    if (errors) {
      return response.status(400).json(errors)
    }

    const user = await userRepository.findOne({ username })

    if (user == null) {
      return response.status(404).json({ error: 'User not found' })
    }

    const correctPassword = await bcrypt.compare(password, user.password)
    if (!correctPassword) {
      return response.status(401).json({ error: 'Invalid password' })
    }

    const payload = {
      iss: APP_URL
      // sub: user.id
    }

    const token = jwt.sign(payload, TOKEN_SECRET as string, { expiresIn: Number(TOKEN_EXPIRATION) * 60 })

    return response.status(201).json({
      Authorization: `${TOKEN_PREFIX} ${token}`
    })
  }
}
