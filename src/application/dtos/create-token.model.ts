export interface CreateTokenRequest {
  readonly username: string
  readonly password: string
}

export interface CreateTokenResponse {
  readonly token: string
}
