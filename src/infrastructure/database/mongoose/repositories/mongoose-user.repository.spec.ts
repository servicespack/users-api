import { describe, expect, it, vi } from 'vitest'
import { User } from '../../../../domain/entities/user.entity'
import { UserNotFoundError } from '../../../../domain/errors'
import { MongooseUserRepository } from './mongoose-user.repository'

describe(MongooseUserRepository.name, () => {
  it('should return null when finding by email and document is not found', async () => {
    const mockModel = {
      findOne: vi.fn().mockResolvedValue(null),
    } as any
    const repository = new MongooseUserRepository(mockModel)

    const result = await repository.findByEmail('notfound@example.com')
    expect(result).toBeNull()
  })

  it('should return null when finding by reset token and document is not found', async () => {
    const mockModel = {
      findOne: vi.fn().mockResolvedValue(null),
    } as any
    const repository = new MongooseUserRepository(mockModel)

    const result = await repository.findByResetToken('nonexistent-token')
    expect(result).toBeNull()
    expect(mockModel.findOne).toHaveBeenCalledWith({ passwordResetToken: 'nonexistent-token' })
  })

  it('should throw UserNotFoundError when updating non-existent user', async () => {
    const mockModel = {
      findById: vi.fn().mockResolvedValue(null),
    } as any
    const repository = new MongooseUserRepository(mockModel)
    const user = new User({
      id: 'invalid-id',
      name: 'name',
      username: 'username',
      email: 'email',
      password: 'password',
    })

    await expect(repository.update(user)).rejects.toThrow(UserNotFoundError)
  })
})
