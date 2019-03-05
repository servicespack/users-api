const mongoose = require('mongoose')
const db = mongoose.connection

const database = process.env.DATABASE || 'mongodb://localhost/ubox'
mongoose.connect(database, { useNewUrlParser: true })

db.on('error', console.error)
db.once('open', () => {
  console.log('[db.js: Connected to the database]')
})

// ---------- Loading models ----------
require('./models/user')

module.exports = db
