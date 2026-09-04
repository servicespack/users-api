import { DomainError } from './domain.error'

export class InvalidCredentialsError extends DomainError {
  constructor(message = 'Invalid credentials') {
    super(message)
  }
}
