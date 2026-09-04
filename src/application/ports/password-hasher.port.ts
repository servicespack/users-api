export interface IPasswordHasher {
  hash: (plainText: string) => Promise<string>
  verify: (hash: string, plainText: string) => Promise<boolean>
}
