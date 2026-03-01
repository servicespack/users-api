import supertest from 'supertest';
import {
  describe, afterAll, it, expect,
} from 'vitest';

import { server } from '../../src/http.server';
import { knex } from '../../src/start/database';
import { mockUser } from '../__mocks__/user';

describe('Tokens (e2e)', () => {
  console.log({ driver: process.env.DATABASE_DRIVER });

  afterAll(async () => {
    await knex.destroy();
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
