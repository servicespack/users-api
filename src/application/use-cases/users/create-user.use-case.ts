import type { IUserRepository } from '../../../domain/repositories/user.repository.interface'
import type { CreateUserRequest } from '../../dtos/create-user.model'
import type { IPasswordHasher } from '../../ports/password-hasher.port'
import crypto from 'node:crypto'
import xss from 'xss'
import { User } from '../../../domain/entities/user.entity'

export class CreateUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordHasher: IPasswordHasher,
  ) {}

  async execute(request: CreateUserRequest): Promise<User> {
    const hashedPassword = await this.passwordHasher.hash(request.password)

    const user = new User({
      name: xss(request.name),
      email: xss(request.email),
      username: xss(request.username),
      password: hashedPassword,
      emailVerificationKey: crypto.randomUUID(),
    })

    return this.userRepository.create(user)
  }
}
