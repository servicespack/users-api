import type { Request, Response } from 'express'
import type { Model } from 'mongoose'

import type { IUser } from '../entities/user'

export class VerificationsController {
  constructor(private readonly userModel: Model<IUser>) { }

  create = async (request: Request, response: Response) => {
    const { user_id: userId, key } = request.body

    const user = await this.userModel.findById(userId)

    if (user == null) {
      return response.status(404).json({
        error: 'User not found',
      })
    }

    if (user.isEmailVerified) {
      return response.status(400).json({
        error: 'Email already verified',
      })
    }

    if (key === user.emailVerificationKey) {
      user.isEmailVerified = true
      user.emailVerificationKey = ''
    }
    else {
      return response.status(401).json({
        error: 'Wrong key',
      })
    }

    await user.save()

    return response.status(201).json({
      success: 'Email verified',
    })
  }
}
