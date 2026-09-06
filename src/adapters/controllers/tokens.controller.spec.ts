import type { Request, Response } from 'express'
import type { Mock } from 'vitest'
import type { CreateTokenUseCase } from '../../application/use-cases/auth/create-token.use-case'

import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'
import { InvalidCredentialsError } from '../../domain/errors'

import { TokensController } from './tokens.controller'

describe(TokensController.name, () => {
  let tokensController: TokensController
  let createTokenUseCase: { execute: Mock }
  let request: Request
  let response: Response

  beforeEach(() => {
    createTokenUseCase = {
      execute: vi.fn(),
    }
    tokensController = new TokensController(
      createTokenUseCase as unknown as CreateTokenUseCase,
      {} as any,
      {} as any,
    )
    request = {
      body: { username: 'testuser', password: 'password123' },
    } as Request
    response = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response
  })

  describe('create', () => {
    it('should return 401 if credentials are invalid', async () => {
      createTokenUseCase.execute.mockRejectedValue(new InvalidCredentialsError())

      await tokensController.create(request, response)

      expect(response.status).toHaveBeenCalledWith(401)
      expect(response.json).toHaveBeenCalledWith({ error: 'Invalid credentials' })
    })

    it('should return 201 with token if credentials are correct', async () => {
      vi.mocked(createTokenUseCase.execute).mockResolvedValue({
        accessToken: 'jwt-token-123',
        refreshToken: 'refresh-token-123',
      })
      await tokensController.create(request, response)

      expect(response.status).toHaveBeenCalledWith(201)
      expect(response.json).toHaveBeenCalledWith({
        Authorization: 'Bearer jwt-token-123',
        RefreshToken: 'refresh-token-123',
      })
    })
  })
})
