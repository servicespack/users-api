const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/ubox')

const db = mongoose.connection
db.on('error', console.error)
db.once('open', () => {
  console.log('[db.js: Connected to the database]')
})

// ---------- Loading models ----------
require('./models/user')

module.exports = db
