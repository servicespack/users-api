const mongoose = require('mongoose')
const db = mongoose.connection

const {
  DB_DRIVER,
  DB_USER,
  DB_PASS,
  DB_HOST,
  DB_PORT,
  DB_NAME
} = process.env

if (DB_DRIVER === 'mongodb') {
  mongoose.connect(
    `mongodb://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}`,
    { useNewUrlParser: true, useUnifiedTopology: true, dbName: DB_NAME }
  )

  db.on('error', console.error)
  db.once('open', () => {
    console.log('[db.js: Connected to the database]')
  })

  // ---------- Loading models ----------
  require('../src/models/user')
  require('../src/models/verification')
} else if (DB_DRIVER === 'mysql') {
  throw new Error('Database driver \'mysql\' not implemented yet.')
} else if (DB_DRIVER) {
  throw new Error('Database driver unknown.')
} else {
  throw new Error('Database driver not provided.')
}

module.exports = db
