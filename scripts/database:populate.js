'use strict'

const { db } = require('../start/')

async function main () {
  if (process.env.APP_ENV !== 'development') {
    throw new Error('Script only allowed in development')
  }

  const { faker } = require('@faker-js/faker')
  const mongoose = require('mongoose')
  const ora = require('ora')
  const { genSaltSync, hashSync } = require('bcryptjs')

  const loading = ora('Populating the database')
  loading.start()

  const User = mongoose.model('User')
  const salt = await genSaltSync(10)

  try {
    for (let i = 1; i <= 100; i++) {
      const user = {
        name: faker.name.findName(),
        email: faker.internet.email(),
        username: faker.internet.userName(),
        password: hashSync(faker.internet.password(), salt)
      }

      await User.create(user)
    }

    loading.succeed('Database populated')
  } catch (error) {
    loading.fail('Error when populating the database')
    console.error(error.message)
  } finally {
    db.close()
  }
}

main()
