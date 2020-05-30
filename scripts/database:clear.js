const { db } = require('../start/')

if (process.env.APP_ENV === 'development') {
  const mongoose = require('mongoose')

  const User = mongoose.model('User')

  User
    .deleteMany({})
    .then(async () => {
      console.log('All users deleted')
      db.close()
    })
} else {
  throw new Error('Script only allowed in development')
}
