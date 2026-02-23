import { faker } from '@faker-js/faker';

export const mockUser = () => ({
  name: faker.person.fullName(),
  email: faker.internet.email().toLowerCase(),
  username: faker.internet.username().toLowerCase(),
  password: faker.internet.password(),
});
