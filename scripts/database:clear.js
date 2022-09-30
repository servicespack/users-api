import mongoose from 'mongoose'
import ora from 'ora'

import { db } from '../start.js'

if (process.env.APP_ENV !== 'development') {
  throw new Error('Script only allowed in development')
}

const loading = ora('Cleaning database')
loading.start()

const User = mongoose.model('User')

User
  .deleteMany({})
  .then(async () => {
    loading.succeed('Database cleaned')
  })
  .catch(() => {
    loading.fail('Error when cleaning database')
  })
  .finally(() => {
    db.close()
  })
