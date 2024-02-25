import { faker } from '@faker-js/faker';
import supertest from 'supertest';

import { server } from '../../src/http.server';
import { mockUser } from '../__mocks__/user';

describe('Update password (e2e)', () => {
  test('Should update an user password', async () => {
    const initialUser = mockUser();

    const { body } = await supertest(server)
      .post('/api/users')
      .send(initialUser);

    const { body: { Authorization } } = await supertest(server)
      .post('/api/tokens')
      .send({
        username: initialUser.username,
        password: initialUser.password,
      });

    const newPassword = faker.internet.password();

    await supertest(server)
      .put(`/api/users/${body.id}/password`)
      .set('Authorization', Authorization)
      .send({
        currentPassword: initialUser.password,
        newPassword,
      })
      .expect(200);

    await supertest(server)
      .post('/api/tokens')
      .send({
        username: initialUser.username,
        password: initialUser.password,
      })
      .expect(401);

    await supertest(server)
      .post('/api/tokens')
      .send({
        username: initialUser.username,
        password: newPassword,
      })
      .expect(201);
  });
});
