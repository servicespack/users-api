import type { User } from '../../../domain/entities/user.entity'
import type { IUserRepository } from '../../../domain/repositories/user.repository.interface'
import type { UpdateUserRequest } from '../../dtos/update-user.model'
import xss from 'xss'
import { UserNotFoundError } from '../../../domain/errors'

export class UpdateUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(request: UpdateUserRequest): Promise<User> {
    const user = await this.userRepository.findById(request.id)

    if (user === null) {
      throw new UserNotFoundError()
    }

    user.updateProfile({
      name: request.name !== undefined ? xss(request.name) : undefined,
      email: request.email !== undefined ? xss(request.email) : undefined,
      username: request.username !== undefined ? xss(request.username) : undefined,
    })

    return this.userRepository.update(user)
  }
}
