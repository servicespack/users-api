const mongoose = require('mongoose')
const db       = mongoose.connection

const DB_USER = process.env.DB_USER
const DB_PASS = process.env.DB_PASS
const DB_HOST = process.env.DB_HOST
const DB_PORT = process.env.DB_PORT
const DB_NAME = process.env.DB_NAME

const databaseUrl = `mongodb://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}`
mongoose.connect(databaseUrl, { useNewUrlParser: true })

db.on('error', console.error)
db.once('open', () => {
  console.log('[db.js: Connected to the database]')
})

// ---------- Loading models ----------
require('./src/models/user')
require('./src/models/verification')

module.exports = db
