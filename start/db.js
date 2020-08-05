'use strict'

const mongoose = require('mongoose')

const { DB_CONNECTION } = process.env

let db

if (DB_CONNECTION === 'mongodb') {
  const { DB_MONGODB_URI } = process.env

  mongoose.connect(DB_MONGODB_URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
  })

  db = mongoose.connection

  db.on('error', console.error)
  db.once('open', () => {
    console.log('[db.js: Connected to the database]')
  })

  require('../src/models/')
} else if (DB_CONNECTION === 'mysql') {
  throw new Error('Database driver \'mysql\' not implemented yet.')
}

module.exports = db
