import supertest from 'supertest'
import {
  afterAll,
  describe,
  expect,
  it,
} from 'vitest'

import { server } from '../../src/infrastructure/http/server'
import { mockUser } from '../__mocks__/user'

describe('tokens (e2e)', () => {
  afterAll(() => {
    server.close()
  })

  it('should create a token', async () => {
    const user = mockUser()

    await supertest(server)
      .post('/api/users')
      .send(user)

    const { body } = await supertest(server)
      .post('/api/tokens')
      .send({
        username: user.username,
        password: user.password,
      })
      .expect(201)

    expect(body).toEqual({
      // eslint-disable-next-line regexp/no-super-linear-backtracking, regexp/strict
      Authorization: expect.stringMatching(/^Bearer [\w-.~+/]+=*(?:\.[\w-.~+/]+=*)*$/),
    })
  })

  it('should return 400 Bad Request when username or password is empty', async () => {
    await supertest(server)
      .post('/api/tokens')
      .send({
        username: '',
        password: '',
      })
      .expect(400)
  })
})
