import type { Request, Response } from 'express'

import type { Model } from 'mongoose'
import type { UpdatePasswordDto } from '../dto/update-password.dto'
import type { UpdateUserDto } from '../dto/update-user.dto'
import type { IUser } from '../entities/user'
import crypto from 'node:crypto'

import { hash, verify } from '@node-rs/argon2'
import safe from 'safe-regex'
import xss from 'xss'

export class UsersController {
  constructor(private readonly userModel: Model<IUser>) { }

  list = async (request: Request, response: Response) => {
    const { page = 1, size = 10, search = '' } = request.query

    if (!safe(search as string)) {
      return response.status(400).json({
        error: 'Invalid search',
      })
    }

    let query = {}

    if (search !== '') {
      query = {
        ...query,
        $text: { $search: search as string },
      }
    }

    const [users, total] = await Promise.all([
      this.userModel
        .find(query)
        .skip((Number(page) - 1) * Number(size))
        .limit(Number(size)),
      this.userModel.countDocuments(query),
    ])

    return response.status(200).json({
      meta: {
        page: Number(page),
        size: Number(size),
        pages: Math.ceil(total / Number(size)),
        total,
      },
      data: users,
    })
  }

  show = async (request: Request, response: Response) => {
    const user = await this.userModel.findById(request.params.id)

    if (user == null) {
      return response.status(404).json({
        error: 'User not found',
      })
    }

    return response.status(200).json(user)
  }

  create = async (request: Request, response: Response) => {
    const {
      name,
      email,
      username,
      password,
    } = request.body

    const data = {
      name: xss(name),
      email: xss(email),
      username: xss(username),
      password,
      emailVerificationKey: crypto.randomUUID(),
    }

    data.password = await hash(data.password)

    const newUser = await this.userModel.create(data)

    return response.status(201).json(newUser)
  }

  update = async (request: Request<any, any, UpdateUserDto>, response: Response) => {
    const user = await this.userModel.findById(request.params.id)

    if (user == null) {
      return response.status(404).json({
        error: 'User not found',
      })
    }

    const { name, email, username } = request.body

    user.name = name ?? user.name
    user.email = email ?? user.email
    user.username = username ?? user.username

    await user.save()

    return response.status(200).json(user)
  }

  updatePassword = async (request: Request<any, any, UpdatePasswordDto>, response: Response) => {
    const user = await this.userModel.findById(request.params.id)

    if (user == null) {
      return response.status(404).json({
        error: 'User not found',
      })
    }

    const { currentPassword, newPassword } = request.body

    const correctPassword = await verify(user.password, currentPassword)
    if (!correctPassword) {
      return response.status(401).json({ error: 'Invalid password' })
    }

    user.password = await hash(newPassword)

    await user.save()

    return response.status(200).json({
      message: 'Password updated',
    })
  }

  delete = async (request: Request, response: Response) => {
    const user = await this.userModel.findById(request.params.id)

    if (user == null) {
      return response.status(404).json({
        error: 'User not found',
      })
    }

    await this.userModel.findByIdAndDelete(user._id)

    return response.status(204).json({})
  }
}
