import type { IPasswordHasher } from '../../application/ports/password-hasher.port'
import { hash, verify } from '@node-rs/argon2'

export class Argon2PasswordHasher implements IPasswordHasher {
  async hash(plainText: string): Promise<string> {
    return hash(plainText)
  }

  async verify(hashed: string, plainText: string): Promise<boolean> {
    return verify(hashed, plainText)
  }
}
