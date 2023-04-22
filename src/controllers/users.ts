import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { type Request, type Response } from 'express'
import mongoose from 'mongoose'
import safe from 'safe-regex'
import xss from 'xss'

const User = mongoose.model('User')
const salt = bcrypt.genSaltSync(10)

export default {
  list: async (request: Request, response: Response) => {
    const { page = 1, size = 10, search = '' } = request.query
  
    if (!safe(search as string)) {
      return response.status(400).json({
        error: 'Invalid search'
      })
    }
  
    const query = {
      $or: [
        { name: new RegExp(search as string, 'gi') },
        { email: new RegExp(search as string, 'gi') },
        { username: new RegExp(search as string, 'gi') }
      ]
    }
  
    const [users, total] = await Promise.all([
      User
        .find(query)
        .skip((Number(page) - 1) * Number(size))
        .limit(Number(size)),
      User.countDocuments(query)
    ])
  
    return response.status(200).json({
      meta: {
        page: Number(page),
        size: Number(size),
        pages: Math.ceil(total / Number(size)),
        total
      },
      data: users
    })
  },
  show: async (request: Request, response: Response) => {
    const user = await User.findById(request.params.id)
  
    if (!user) {
      return response.status(404).json({
        error: 'User not found'
      })
    }
  
    return response.status(200).json(user)
  },  
  create: async (request: Request, response: Response) => {
    const { name, email, username, password } = request.body
  
    const data = {
      name: xss(name),
      email: xss(email),
      username: xss(username),
      password,
      email_verification_key: crypto.randomUUID()
    }
  
    data.password = bcrypt.hashSync(data.password, salt)
  
    const newUser = new User(data)
  
    try {
      const {
        _id,
        name,
        email,
        username,
        email_verification_key: emailVerificationKey
      } = await newUser.save()
  
      response.status(201).json({
        _id,
        name,
        email,
        username
      })
    } catch (error) {
      return response.status(400).json({ error })
    }
  },
  update: async (request: Request, response: Response) => {
    const user = await User.findById(request.params.id)
  
    if (!user) {
      return response.status(404).json({
        error: 'User not found'
      })
    }
  
    const { name, email, username } = request.body
  
    user.name = name || user.name
    user.email = email || user.email
    user.username = username || user.username
    await user.save()
  
    return response.status(200).json(user)
  },
  updatePassword: async (request: Request, response: Response) => {
    const user = await User
      .findById(request.params.id)
      .select('+password')
  
    if (!user) {
      return response.status(404).json({
        error: 'User not found'
      })
    }
  
    const {
      current_password: currentPassword,
      new_password: newPassword
    } = request.body
  
    const correctPassword = await bcrypt.compare(currentPassword, user.password)
    if (!correctPassword) {
      return response.status(401).json({ error: 'Invalid password' })
    }
  
    user.password = bcrypt.hashSync(newPassword, salt)
  
    await user.save()
  
    return response.status(200).json({
      message: 'Password updated'
    })
  },
  delete: async (request: Request, response: Response) => {
    const user = await User.findById(request.params.id)
  
    if (!user) {
      return response.status(404).json({
        error: 'User not found'
      })
    }
  
    await user.delete()
  
    return response.status(204).json({})
  }
}