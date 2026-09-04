import type { Request, Response } from 'express'
import type { Model } from 'mongoose'
import type { IUser } from '../entities/user'
import { verify } from '@node-rs/argon2'

import jwt from 'jsonwebtoken'
import { configuration } from '../config'

export class TokensController {
  private readonly TOKEN_SECRET = configuration.auth.jwtSecret

  private readonly TOKEN_EXPIRATION = Number(configuration.auth.jwtExpiration)

  constructor(private readonly userModel: Model<IUser>) { }

  create = async (request: Request, response: Response) => {
    const { username, password } = request.body

    const user = await this.userModel.findOne({ username })

    if (user === null) {
      return response.status(401).json({ error: 'Invalid credentials' })
    }

    const correctPassword = await verify(user.password, password)

    if (!correctPassword) {
      return response.status(401).json({ error: 'Invalid credentials' })
    }

    const payload = {
      iss: 'users-service',
      sub: user.id,
    }

    const token = jwt.sign(payload, this.TOKEN_SECRET, { expiresIn: this.TOKEN_EXPIRATION * 60 })

    return response.status(201).json({
      Authorization: `Bearer ${token}`,
    })
  }
}
