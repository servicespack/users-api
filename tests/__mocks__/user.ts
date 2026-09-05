import { faker } from '@faker-js/faker'

export function mockUser() {
  return {
    name: faker.person.fullName(),
    email: faker.internet.email().toLowerCase(),
    username: faker.internet.username().toLowerCase(),
    password: faker.internet.password(),
  }
}
