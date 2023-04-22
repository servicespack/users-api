import { type Request, type Response } from 'express'
import mongoose from 'mongoose'

const User = mongoose.model('User')

export default {
  create: async (request: Request, response: Response) => {
    const { user_id: userId, type, key } = request.body
  
    const user = await User
      .findById(userId)
      .select('+email_verification_key')
  
    if (!user) {
      return response.status(404).json({
        error: 'User not found'
      })
    }
  
    switch (type) {
      case 'email':
        if (key === user.email_verification_key) {
          user.is_email_verified = true
          user.email_verification_key = ''
        } else {
          return response.status(401).json({
            error: 'Wrong key'
          })
        }
  
        break
    }
  
    await user.save()
  
    response.status(201).json({
      success: 'Email verified'
    })
  }
}
