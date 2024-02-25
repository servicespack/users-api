import supertest from 'supertest';

import { server } from '../../src/http.server';
import { orm } from '../../src/start/database';
import { mockUser } from '../__mocks__/user';

describe('Tokens (e2e)', () => {
  afterAll(async () => {
    await orm.close();
  });

  it('Should create a token', async () => {
    const user = mockUser();

    await supertest(server)
      .post('/api/users')
      .send(user);

    const { body } = await supertest(server)
      .post('/api/tokens')
      .send({
        username: user.username,
        password: user.password,
      })
      .expect(201);

    expect(body).toEqual({
      Authorization: expect.stringMatching(/^Bearer [A-Za-z0-9-._~+/]+=*(?:\.[A-Za-z0-9-._~+/]+=*)*$/),
    });
  });
});
