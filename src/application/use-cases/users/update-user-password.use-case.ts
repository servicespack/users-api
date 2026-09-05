import type { IUserRepository } from '../../../domain/repositories/user.repository.interface'
import type { UpdatePasswordRequest } from '../../dtos/update-password.model'
import type { IPasswordHasher } from '../../ports/password-hasher.port'
import {
  InvalidPasswordError,
  UserNotFoundError,
} from '../../../domain/errors'

export class UpdateUserPasswordUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordHasher: IPasswordHasher,
  ) {}

  async execute(request: UpdatePasswordRequest): Promise<void> {
    const user = await this.userRepository.findById(request.id)

    if (user === null) {
      throw new UserNotFoundError()
    }

    const isPasswordCorrect = await this.passwordHasher.verify(
      user.password,
      request.currentPassword,
    )

    if (!isPasswordCorrect) {
      throw new InvalidPasswordError()
    }

    const newHashedPassword = await this.passwordHasher.hash(request.newPassword)
    user.changePassword(newHashedPassword)

    await this.userRepository.update(user)
  }
}
