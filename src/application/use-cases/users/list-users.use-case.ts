import type { IUserRepository } from '../../../domain/repositories/user.repository.interface'
import type { ListUsersRequest, ListUsersResponse } from '../../dtos/list-users.model'
import safe from 'safe-regex'
import { InvalidSearchQueryError } from '../../../domain/errors'

export class ListUsersUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(request: ListUsersRequest): Promise<ListUsersResponse> {
    const page = Number(request.page ?? 1)
    const size = Number(request.size ?? 10)
    const search = request.search ?? ''

    if (search !== '' && !safe(search)) {
      throw new InvalidSearchQueryError()
    }

    const { users, total } = await this.userRepository.list({
      page,
      size,
      search,
    })

    return {
      meta: {
        page,
        size,
        pages: Math.ceil(total / size),
        total,
      },
      data: users,
    }
  }
}
