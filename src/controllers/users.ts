import crypto from 'node:crypto'

import type { FilterQuery } from '@mikro-orm/core'
import type { Request, Response } from 'express'
import { plainToClass } from 'class-transformer'
import bcrypt from 'bcryptjs'
import safe from 'safe-regex'
import xss from 'xss'

import type { UpdateUserDto } from '../dto/update-user.dto'
import { User } from '../entities/user'
import { orm } from '../start/database'

const userRepository = orm.em.fork().getRepository(User)
const salt = bcrypt.genSaltSync(10)

export default {
  list: async (request: Request, response: Response) => {
    const { page = 1, size = 10, search = '' } = request.query

    if (!safe(search as string)) {
      return response.status(400).json({
        error: 'Invalid search'
      })
    }

    let query: FilterQuery<User> = {}

    if (search !== '') {
      query = {
        ...query,
        $or: [
          { name: { $fulltext: search as string } },
          { email: { $fulltext: search as string } },
          { username: { $fulltext: search as string } }
        ]
      }
    }

    const [users, total] = await Promise.all([
      userRepository
        .find(query, {
          offset: (Number(page) - 1) * Number(size),
          limit: Number(size)
        }),
      userRepository.count(query)
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
    const user = await userRepository.findOne(request.params.id as any)

    if (user == null) {
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
      emailVerificationKey: crypto.randomUUID()
    }

    data.password = bcrypt.hashSync(data.password, salt)

    const newUser = plainToClass<User, any>(User, data)

    await orm.em.fork().persistAndFlush(newUser)

    response.status(201).json(newUser)
  },
  update: async (request: Request<any, any, UpdateUserDto>, response: Response) => {
    const user = await userRepository.findOne(request.params.id)

    if (user == null) {
      return response.status(404).json({
        error: 'User not found'
      })
    }

    const { name, email, username } = request.body

    user.name = name ?? user.name
    user.email = email ?? user.email
    user.username = username ?? user.username
    await userRepository.flush()

    return response.status(200).json(user)
  },
  updatePassword: async (request: Request, response: Response) => {
    const user = await userRepository
      .findOne(request.params.id as any)

    if (user == null) {
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

    await userRepository.flush()

    return response.status(200).json({
      message: 'Password updated'
    })
  },
  delete: async (request: Request, response: Response) => {
    const user = await userRepository.findOne(request.params.id as any)

    if (user == null) {
      return response.status(404).json({
        error: 'User not found'
      })
    }

    await userRepository.nativeDelete(user)

    return response.status(204).json({})
  }
}
