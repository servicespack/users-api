const { db } = require('../start/')

if (process.env.APP_ENV === 'development') {
  const faker = require('faker')
  const mongoose = require('mongoose')

  const users = Array(100).fill(null).map(() => ({
    name: faker.name.findName(),
    email: faker.internet.email(),
    username: faker.internet.userName(),
    password: faker.internet.password()
  }))

  const User = mongoose.model('User')

  User
    .insertMany(users)
    .then(async () => {
      console.log('Fake users inserted')
      db.close()
    })
} else {
  throw new Error('Script only allowed in development')
}
