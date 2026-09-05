import type { IUserRepository } from '../../../domain/repositories/user.repository.interface'
import { UserNotFoundError } from '../../../domain/errors'

export class DeleteUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(id: string): Promise<void> {
    const user = await this.userRepository.findById(id)

    if (user === null) {
      throw new UserNotFoundError()
    }

    await this.userRepository.delete(id)
  }
}
