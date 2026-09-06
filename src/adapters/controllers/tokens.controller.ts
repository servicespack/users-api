import type { Request, Response } from 'express'
import type { CreateTokenUseCase } from '../../application/use-cases/auth/create-token.use-case'
import type { LogoutUseCase } from '../../application/use-cases/auth/logout.use-case'

import type { RefreshTokenUseCase } from '../../application/use-cases/auth/refresh-token.use-case'
import { handleHttpError } from '../helpers/http-error.helper'

export class TokensController {
  constructor(
    private readonly createTokenUseCase: CreateTokenUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly logoutUseCase: LogoutUseCase,
  ) {}

  async create(request: Request, response: Response) {
    try {
      const { username, password } = request.body
      const { accessToken, refreshToken } = await this.createTokenUseCase.execute({ username, password })

      return response.status(201).json({
        Authorization: `Bearer ${accessToken}`,
        RefreshToken: refreshToken,
      })
    }
    catch (error) {
      return handleHttpError(error, response)
    }
  }

  async refresh(request: Request, response: Response) {
    try {
      const { refreshToken } = request.body
      const { accessToken, refreshToken: newRefreshToken } = await this.refreshTokenUseCase.execute({ refreshToken })

      return response.status(201).json({
        Authorization: `Bearer ${accessToken}`,
        RefreshToken: newRefreshToken,
      })
    }
    catch (error) {
      return handleHttpError(error, response)
    }
  }

  async logout(request: Request, response: Response) {
    try {
      const { refreshToken } = request.body
      await this.logoutUseCase.execute({ refreshToken })

      return response.status(204).send()
    }
    catch (error) {
      return handleHttpError(error, response)
    }
  }
}
