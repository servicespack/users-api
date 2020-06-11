'use strict'

const mongoose = require('mongoose')
const db = mongoose.connection

const { DB_CONNECTION } = process.env

if (DB_CONNECTION === 'mongodb') {
  const { DB_MONGODB_URI } = process.env

  mongoose.connect(DB_MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })

  db.on('error', console.error)
  db.once('open', () => {
    console.log('[db.js: Connected to the database]')
  })

  require('../src/models/user')
} else if (DB_CONNECTION === 'mysql') {
  throw new Error('Database driver \'mysql\' not implemented yet.')
}

module.exports = db
