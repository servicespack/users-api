import type { Request, Response } from 'express'
import { verify } from '@node-rs/argon2'
import jwt from 'jsonwebtoken'
import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'

import { TokensController } from './tokens.controller'

vi.mock('@node-rs/argon2')
vi.mock('jsonwebtoken')

describe(TokensController.name, () => {
  let tokensController: TokensController
  let userModel: any
  let request: Request
  let response: Response

  beforeEach(() => {
    userModel = {
      findOne: vi.fn(),
    }
    tokensController = new TokensController(userModel)
    request = {
      body: { username: 'testuser', password: 'password123' },
    } as Request
    response = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response
  })

  describe('create', () => {
    it('should return 401 if user is not found', async () => {
      userModel.findOne.mockResolvedValue(null)

      await tokensController.create(request, response)

      expect(response.status).toHaveBeenCalledWith(401)
      expect(response.json).toHaveBeenCalledWith({ error: 'Invalid credentials' })
    })

    it('should return 401 if password is incorrect', async () => {
      const user = { username: 'testuser', password: 'hashedpassword' }
      userModel.findOne.mockResolvedValue(user)
      vi.mocked(verify).mockResolvedValue(false)

      await tokensController.create(request, response)

      expect(response.status).toHaveBeenCalledWith(401)
      expect(response.json).toHaveBeenCalledWith({ error: 'Invalid credentials' })
    })

    it('should return 201 with token if credentials are correct', async () => {
      const user = { id: 'user-id', username: 'testuser', password: 'hashedpassword' }
      userModel.findOne.mockResolvedValue(user)
      vi.mocked(verify).mockResolvedValue(true)
      vi.mocked(jwt.sign).mockReturnValue('mocked-token' as any)

      await tokensController.create(request, response)

      expect(response.status).toHaveBeenCalledWith(201)
      expect(response.json).toHaveBeenCalledWith({
        Authorization: 'Bearer mocked-token',
      })
    })
  })
})
