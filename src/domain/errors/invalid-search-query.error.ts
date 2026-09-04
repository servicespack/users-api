import { DomainError } from './domain.error'

export class InvalidSearchQueryError extends DomainError {
  constructor(message = 'Invalid search') {
    super(message)
  }
}
