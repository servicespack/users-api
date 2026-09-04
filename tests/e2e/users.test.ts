import jwt from 'jsonwebtoken'
import supertest from 'supertest'
import {
  afterAll,
  describe,
  expect,
  it,
} from 'vitest'

import { server } from '../../src/http.server'
import { mockUser } from '../__mocks__/user'

describe('users (e2e)', () => {
  let token: string

  afterAll(() => {
    server.close()
  })

  const user = mockUser()

  it('should create an user', async () => {
    await supertest(server)
      .post('/api/users')
      .send(user)
      .expect('Content-Type', /json/)
      .expect(201)

    const { body } = await supertest(server)
      .post('/api/tokens')
      .send({
        username: user.username,
        password: user.password,
      })

    token = body.Authorization
  })

  it('should not create user with duplicate email/username (409 Conflict)', async () => {
    await supertest(server)
      .post('/api/users')
      .send(user)
      .expect('Content-Type', /json/)
      .expect(409)
      .expect((res) => {
        expect(res.body.error).toBe('Duplicate key error')
      })
  })

  it('should list a page of users', async () => {
    const { body } = await supertest(server)
      .get('/api/users')
      .set('Authorization', token)
      .expect(200)

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
    })
  })

  it('should return 401 when no token is provided', async () => {
    await supertest(server)
      .get('/api/users')
      .expect(401)
      .expect((res) => {
        expect(res.body.error).toBe('No token provided')
      })
  })

  it('should return 401 when an invalid token is provided', async () => {
    await supertest(server)
      .get('/api/users')
      .set('Authorization', 'Bearer invalidtoken')
      .expect(401)
  })

  it('should list users with search query', async () => {
    const { body } = await supertest(server)
      .get(`/api/users?search=${user.username}`)
      .set('Authorization', token)
      .expect(200)

    expect(body.data).toBeInstanceOf(Array)
  })

  it('should detail the user', async () => {
    const id = jwt.decode(token.split(' ')[1])?.sub

    const { body } = await supertest(server)
      .get(`/api/users/${id}`)
      .set('Authorization', token)
      .expect(200)

    expect(body).toMatchObject({
      name: user.name,
      email: user.email.toLowerCase(),
      username: user.username.toLowerCase(),
    })
  })

  it('should delete the user', () => {
    const id = jwt.decode(token.split(' ')[1])?.sub

    return supertest(server)
      .delete(`/api/users/${id}`)
      .set('Authorization', token)
      .expect(204)
  })
})
