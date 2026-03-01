import jwt from 'jsonwebtoken';
import supertest from 'supertest';
import {
  describe, it, afterAll, expect,
} from 'vitest';

import { server } from '../../src/http.server';
import { knex } from '../../src/start/database';
import { mockUser } from '../__mocks__/user';

describe('Users (e2e)', () => {
  let token: string;

  afterAll(async () => {
    await knex.destroy();
  });

  const user = mockUser();

  it('Should create an user', async () => {
    await supertest(server)
      .post('/api/users')
      .send(user)
      .expect('Content-Type', /json/)
      .expect(201);

    const { body } = await supertest(server)
      .post('/api/tokens')
      .send({
        username: user.username,
        password: user.password,
      });

    token = body.Authorization;
  });

  it('Should list a page of users', async () => {
    const { body } = await supertest(server)
      .get('/api/users')
      .set('Authorization', token)
      .expect(200);

    expect(body).toMatchObject({
      meta: {
        page: expect.any(Number),
        size: expect.any(Number),
        total: expect.any(Number),
      },
      data: expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          name: user.name,
          username: user.username.toLowerCase(),
          email: user.email.toLowerCase(),
        }),
      ]),
    });
  });

  it('Should detail the user', async () => {
    const id = jwt.decode(token.split(' ')[1])?.sub;

    const { body } = await supertest(server)
      .get(`/api/users/${id}`)
      .set('Authorization', token)
      .expect(200);

    expect(body).toMatchObject({
      name: user.name,
      email: user.email.toLowerCase(),
      username: user.username.toLowerCase(),
    });
  });

  it('Should delete the user', () => {
    const id = jwt.decode(token.split(' ')[1])?.sub;

    return supertest(server)
      .delete(`/api/users/${id}`)
      .set('Authorization', token)
      .expect(204);
  });
});
