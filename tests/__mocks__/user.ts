import { faker } from '@faker-js/faker';

export const mockUser = () => ({
  name: faker.name.fullName(),
  email: faker.internet.email().toLowerCase(),
  username: faker.internet.userName().toLowerCase(),
  password: faker.internet.password(),
});
