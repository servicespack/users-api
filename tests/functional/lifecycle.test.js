import { faker } from '@faker-js/faker'
import fetch from 'node-fetch'
import jwt from 'jsonwebtoken'

const BASE_URL = 'http://localhost:4000'

describe('Testing the users lifecycle', () => {
  let api

  beforeAll(async () => {
    process.env.APP_ENV = 'testing'
    process.env.DB_MONGODB_URI = process.env.MONGO_URL

    api = await import('../../index.js')
  })

  afterAll(() => {
    api.default.turnOff()
  })

  const user = {
    name: faker.name.fullName(),
    email: faker.internet.email(),
    username: faker.internet.userName(),
    password: faker.internet.password()
  }

  let token = ''

  test('Should create an user', async () => {
    const response = await fetch(`${BASE_URL}/api/users`, {
      method: 'POST',
      body: JSON.stringify(user),
      headers: { 'Content-Type': 'application/json' }
    })

    expect(response.status).toEqual(201)

    const data = await response.json()

    expect(data).toMatchObject({
      name: user.name,
      email: user.email.toLowerCase(),
      username: user.username.toLowerCase()
    })
  })

  test('Should create an token for authentication', async () => {
    const response = await fetch(`${BASE_URL}/api/tokens`, {
      method: 'POST',
      body: JSON.stringify({
        username: user.username,
        password: user.password
      }),
      headers: { 'Content-Type': 'application/json' }
    })

    const data = await response.json()

    token = data.Authorization

    expect(response.status).toEqual(201)
  })

  test('Should list a page of users', async () => {
    const response = await fetch(`${BASE_URL}/api/users`, {
      method: 'GET',
      headers: { Authorization: token }
    })

    const data = await response.json()

    expect(data).toMatchObject({
      meta: {
        page: expect.any(Number),
        size: expect.any(Number),
        total: expect.any(Number)
      },
      data: [
        {
          _id: expect.any(String),
          name: user.name,
          username: user.username.toLowerCase(),
          email: user.email.toLowerCase()
        }
      ]
    })

    expect(response.status).toEqual(200)
  })

  test('Should detail the user', async () => {
    const { sub: id } = jwt.decode(token.split(' ')[1])

    const response = await fetch(`${BASE_URL}/api/users/${id}`, {
      method: 'GET',
      headers: { Authorization: token }
    })

    expect(response.status).toEqual(200)

    const data = await response.json()

    expect(data).toMatchObject({
      name: user.name,
      email: user.email.toLowerCase(),
      username: user.username.toLowerCase()
    })
  })

  test('Should delete the user', async () => {
    const { sub: id } = jwt.decode(token.split(' ')[1])

    const response = await fetch(`${BASE_URL}/api/users/${id}`, {
      method: 'DELETE',
      headers: { Authorization: token }
    })

    expect(response.status).toEqual(204)
  })
})
