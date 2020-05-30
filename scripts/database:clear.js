const { db } = require('../start/')

const mongoose = require('mongoose')

const User = mongoose.model('User')

User
  .deleteMany({})
  .then(async () => {
    console.log('All users deleted')
    db.close()
  })
