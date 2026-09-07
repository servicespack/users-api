import type { IRefreshTokenRepository } from '../../../domain/repositories/refresh-token.repository.interface'
import type { ITokenProvider } from '../../ports/token-provider.port'
import crypto from 'node:crypto'
import { RefreshToken } from '../../../domain/entities/refresh-token.entity'
import { InvalidTokenError } from '../../../domain/errors'

export interface RefreshTokenRequest {
  refreshToken: string
}

export interface RefreshTokenResponse {
  accessToken: string
  refreshToken: string
}

export class RefreshTokenUseCase {
  constructor(
    private readonly refreshTokenRepository: IRefreshTokenRepository,
    private readonly tokenProvider: ITokenProvider,
  ) {}

  async execute(request: RefreshTokenRequest): Promise<RefreshTokenResponse> {
    const existingToken = await this.refreshTokenRepository.findByToken(request.refreshToken)

    if (!existingToken || !existingToken.isValid()) {
      throw new InvalidTokenError()
    }

    // Revoke the old token (Rolling Refresh Tokens)
    existingToken.revoke()
    await this.refreshTokenRepository.update(existingToken)

    const userId = existingToken.userId

    const accessToken = this.tokenProvider.generate({
      iss: 'users-service',
      sub: userId,
    })

    const newRefreshTokenString = crypto.randomBytes(40).toString('hex')
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7) // 7 days expiration

    const newRefreshToken = new RefreshToken({
      token: newRefreshTokenString,
      userId,
      expiresAt,
    })

    await this.refreshTokenRepository.create(newRefreshToken)

    return { accessToken, refreshToken: newRefreshTokenString }
  }
}
