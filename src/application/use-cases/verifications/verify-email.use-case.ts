import type { IUserRepository } from '../../../domain/repositories/user.repository.interface'
import type { VerifyEmailRequest } from '../../dtos/verify-email.model'
import { UserNotFoundError } from '../../../domain/errors'

export class VerifyEmailUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(request: VerifyEmailRequest): Promise<void> {
    const user = await this.userRepository.findById(request.userId)

    if (user === null) {
      throw new UserNotFoundError()
    }

    user.verifyEmail(request.key)

    await this.userRepository.update(user)
  }
}
