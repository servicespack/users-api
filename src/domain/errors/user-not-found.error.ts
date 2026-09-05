import { DomainError } from './domain.error'

export class UserNotFoundError extends DomainError {
  constructor(message = 'User not found') {
    super(message)
  }
}
