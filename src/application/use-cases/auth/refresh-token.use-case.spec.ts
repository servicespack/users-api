import type { IRefreshTokenRepository } from '../../../domain/repositories/refresh-token.repository.interface'
import type { ITokenProvider } from '../../ports/token-provider.port'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { RefreshToken } from '../../../domain/entities/refresh-token.entity'
import { InvalidTokenError } from '../../../domain/errors'
import { RefreshTokenUseCase } from './refresh-token.use-case'

describe(RefreshTokenUseCase.name, () => {
  let refreshTokenRepository: IRefreshTokenRepository
  let tokenProvider: ITokenProvider
  let useCase: RefreshTokenUseCase

  beforeEach(() => {
    refreshTokenRepository = {
      create: vi.fn(),
      findByToken: vi.fn(),
      update: vi.fn(),
      revokeAllForUser: vi.fn(),
    }
    tokenProvider = {
      generate: vi.fn().mockReturnValue('new.access.token'),
    }
    useCase = new RefreshTokenUseCase(refreshTokenRepository, tokenProvider)
  })

  it('should throw InvalidTokenError if refresh token does not exist', async () => {
    vi.mocked(refreshTokenRepository.findByToken).mockResolvedValue(null)

    await expect(useCase.execute({
      refreshToken: 'non-existent',
    })).rejects.toThrow(InvalidTokenError)
  })

  it('should throw InvalidTokenError if refresh token is expired or revoked', async () => {
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() - 1) // expired
    const refreshToken = new RefreshToken({
      id: 'token-id',
      token: 'expired-token',
      userId: 'user-id',
      expiresAt,
    })

    vi.mocked(refreshTokenRepository.findByToken).mockResolvedValue(refreshToken)

    await expect(useCase.execute({
      refreshToken: 'expired-token',
    })).rejects.toThrow(InvalidTokenError)
  })

  it('should successfully refresh token with rolling refresh tokens', async () => {
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7)
    const refreshToken = new RefreshToken({
      id: 'token-id',
      token: 'valid-token',
      userId: 'user-id',
      expiresAt,
    })

    vi.mocked(refreshTokenRepository.findByToken).mockResolvedValue(refreshToken)

    const result = await useCase.execute({
      refreshToken: 'valid-token',
    })

    expect(refreshTokenRepository.findByToken).toHaveBeenCalledWith('valid-token')
    expect(refreshToken.isRevoked).toBe(true)
    expect(refreshTokenRepository.update).toHaveBeenCalledWith(refreshToken)
    expect(tokenProvider.generate).toHaveBeenCalledWith({
      iss: 'users-service',
      sub: 'user-id',
    })
    expect(result.accessToken).toBe('new.access.token')
    expect(result.refreshToken).toBeTypeOf('string')
    expect(result.refreshToken).toHaveLength(80)
    expect(refreshTokenRepository.create).toHaveBeenCalled()
  })
})
