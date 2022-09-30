import { db } from '../start'

async function main () {
  if (process.env.APP_ENV !== 'development') {
    throw new Error('Script only allowed in development')
  }

  const { faker } = await import('@faker-js/faker')
  const mongoose = await import('mongoose')
  const ora = await import('ora')
  const { genSaltSync, hashSync } = await import('bcryptjs')

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
