export interface UpdatePasswordRequest {
  readonly id: string
  readonly currentPassword: string
  readonly newPassword: string
}
