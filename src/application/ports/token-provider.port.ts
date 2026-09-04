export interface TokenPayload {
  readonly iss?: string
  readonly sub: string
}

export interface ITokenProvider {
  generate: (payload: TokenPayload) => string
}
