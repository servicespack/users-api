import { describe, expect, it } from 'vitest'
import {
  EmailAlreadyVerifiedError,
  WrongVerificationKeyError,
} from '../errors'
import { User } from './user.entity'

describe('user Entity', () => {
  it('should instantiate a user with provided properties', () => {
    const user = new User({
      id: 'user-id-1',
      name: 'John Doe',
      email: 'john@example.com',
      username: 'johndoe',
      password: 'hashed-password',
      isEmailVerified: false,
      emailVerificationKey: 'verify-123',
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-02'),
    })

    expect(user.id).toBe('user-id-1')
    expect(user.name).toBe('John Doe')
    expect(user.email).toBe('john@example.com')
    expect(user.username).toBe('johndoe')
    expect(user.password).toBe('hashed-password')
    expect(user.isEmailVerified).toBe(false)
    expect(user.emailVerificationKey).toBe('verify-123')
    expect(user.createdAt).toEqual(new Date('2023-01-01'))
    expect(user.updatedAt).toEqual(new Date('2023-01-02'))
  })

  it('should update profile fields', () => {
    const user = new User({
      name: 'John Doe',
      email: 'john@example.com',
      username: 'johndoe',
      password: 'hashed-password',
    })

    user.updateProfile({ name: 'Jane Doe', email: 'jane@example.com' })

    expect(user.name).toBe('Jane Doe')
    expect(user.email).toBe('jane@example.com')
    expect(user.username).toBe('johndoe')

    user.updateProfile({ username: 'janedoe' })
    expect(user.username).toBe('janedoe')
  })

  it('should change password', () => {
    const user = new User({
      name: 'John',
      email: 'john@example.com',
      username: 'john',
      password: 'old-hashed-password',
    })

    user.changePassword('new-hashed-password')
    expect(user.password).toBe('new-hashed-password')
  })

  it('should verify email with correct key', () => {
    const user = new User({
      name: 'John',
      email: 'john@example.com',
      username: 'john',
      password: 'hashed-password',
      isEmailVerified: false,
      emailVerificationKey: 'correct-key',
    })

    user.verifyEmail('correct-key')

    expect(user.isEmailVerified).toBe(true)
    expect(user.emailVerificationKey).toBe('')
  })

  it('should throw WrongVerificationKeyError if key does not match', () => {
    const user = new User({
      name: 'John',
      email: 'john@example.com',
      username: 'john',
      password: 'hashed-password',
      isEmailVerified: false,
      emailVerificationKey: 'correct-key',
    })

    expect(() => user.verifyEmail('wrong-key')).toThrow(WrongVerificationKeyError)
  })

  it('should throw EmailAlreadyVerifiedError if already verified', () => {
    const user = new User({
      name: 'John',
      email: 'john@example.com',
      username: 'john',
      password: 'hashed-password',
      isEmailVerified: true,
      emailVerificationKey: '',
    })

    expect(() => user.verifyEmail('any-key')).toThrow(EmailAlreadyVerifiedError)
  })

  it('should return sanitized JSON', () => {
    const user = new User({
      id: '123',
      name: 'John',
      email: 'john@example.com',
      username: 'john',
      password: 'secret-hash',
      emailVerificationKey: 'secret-key',
      isEmailVerified: false,
    })

    expect(user.toJSON()).toEqual({
      id: '123',
      name: 'John',
      email: 'john@example.com',
      username: 'john',
      isEmailVerified: false,
    })
  })
})
