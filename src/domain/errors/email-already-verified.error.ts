import { DomainError } from './domain.error'

export class EmailAlreadyVerifiedError extends DomainError {
  constructor(message = 'Email already verified') {
    super(message)
  }
}
