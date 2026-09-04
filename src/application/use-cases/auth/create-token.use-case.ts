import type { IUserRepository } from '../../../domain/repositories/user.repository.interface'
import type { CreateTokenRequest, CreateTokenResponse } from '../../dtos/create-token.model'
import type { IPasswordHasher } from '../../ports/password-hasher.port'
import type { ITokenProvider } from '../../ports/token-provider.port'
import { InvalidCredentialsError } from '../../../domain/errors'

export class CreateTokenUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordHasher: IPasswordHasher,
    private readonly tokenProvider: ITokenProvider,
  ) {}

  async execute(request: CreateTokenRequest): Promise<CreateTokenResponse> {
    const user = await this.userRepository.findByUsername(request.username)

    if (user === null || !user.id) {
      throw new InvalidCredentialsError()
    }

    const isPasswordCorrect = await this.passwordHasher.verify(
      user.password,
      request.password,
    )

    if (!isPasswordCorrect) {
      throw new InvalidCredentialsError()
    }

    const token = this.tokenProvider.generate({
      iss: 'users-service',
      sub: user.id,
    })

    return { token }
  }
}
