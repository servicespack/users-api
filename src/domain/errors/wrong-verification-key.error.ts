import { DomainError } from './domain.error'

export class WrongVerificationKeyError extends DomainError {
  constructor(message = 'Wrong key') {
    super(message)
  }
}
