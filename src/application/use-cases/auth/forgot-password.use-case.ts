import type { IUserRepository } from '../../../domain/repositories/user.repository.interface'
import type {
  ForgotPasswordRequest,
  ForgotPasswordResponse,
} from '../../dtos/forgot-password.model'
import { randomUUID } from 'node:crypto'

const FIFTEEN_MINUTES_MS = 15 * 60 * 1000

export class ForgotPasswordUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly tokenGenerator: () => string = randomUUID,
  ) {}

  async execute(request: ForgotPasswordRequest): Promise<ForgotPasswordResponse> {
    const user = await this.userRepository.findByEmail(request.email)

    if (user === null) {
      return {}
    }

    const token = this.tokenGenerator()
    const expiresAt = new Date(Date.now() + FIFTEEN_MINUTES_MS)

    user.requestPasswordReset(token, expiresAt)

    await this.userRepository.update(user)

    return { resetToken: token }
  }
}
