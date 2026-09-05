import type { Request, Response } from 'express'
import type { CreateTokenUseCase } from '../../application/use-cases/auth/create-token.use-case'
import { handleHttpError } from '../helpers/http-error.helper'

export class TokensController {
  constructor(private readonly createTokenUseCase: CreateTokenUseCase) {}

  create = async (request: Request, response: Response) => {
    try {
      const { username, password } = request.body
      const { token } = await this.createTokenUseCase.execute({ username, password })

      return response.status(201).json({
        Authorization: `Bearer ${token}`,
      })
    }
    catch (error) {
      return handleHttpError(error, response)
    }
  }
}
