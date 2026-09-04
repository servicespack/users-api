import type { User } from '../../domain/entities/user.entity'

export interface ListUsersRequest {
  readonly page?: number | string
  readonly size?: number | string
  readonly search?: string
}

export interface ListUsersResponse {
  readonly meta: {
    readonly page: number
    readonly size: number
    readonly pages: number
    readonly total: number
  }
  readonly data: readonly User[]
}
