const mongoose = require('mongoose')
const db = mongoose.connection

const {
  DB_CONNECTION,
  DB_USER,
  DB_PASS,
  DB_HOST,
  DB_PORT,
  DB_NAME
} = process.env

if (DB_CONNECTION === 'mongodb') {
  mongoose.connect(
    `mongodb://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}`,
    { useNewUrlParser: true, useUnifiedTopology: true, dbName: DB_NAME }
  )

  db.on('error', console.error)
  db.once('open', () => {
    console.log('[db.js: Connected to the database]')
  })

  require('../src/models/user')
} else if (DB_CONNECTION === 'mysql') {
  throw new Error('Database driver \'mysql\' not implemented yet.')
}

module.exports = db
