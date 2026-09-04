import type { User } from '../../../domain/entities/user.entity'
import type { IUserRepository } from '../../../domain/repositories/user.repository.interface'
import { UserNotFoundError } from '../../../domain/errors'

export class GetUserByIdUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(id: string): Promise<User> {
    const user = await this.userRepository.findById(id)

    if (user === null) {
      throw new UserNotFoundError()
    }

    return user
  }
}
