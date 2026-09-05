import type { ITokenProvider, TokenPayload } from '../../application/ports/token-provider.port'
import jwt from 'jsonwebtoken'
import { configuration } from '../../config'

export class JwtTokenProvider implements ITokenProvider {
  constructor(
    private readonly secret: string = configuration.auth.jwtSecret,
    private readonly expirationInMinutes: number = Number(configuration.auth.jwtExpiration),
  ) {}

  generate(payload: TokenPayload): string {
    return jwt.sign(payload, this.secret, {
      expiresIn: this.expirationInMinutes * 60,
    })
  }
}
