import mongoose from 'mongoose'

import '../models'

const { DB_CONNECTION } = process.env

let db!: mongoose.Connection

if (DB_CONNECTION === 'mongodb') {
  const { DB_MONGODB_URI } = process.env

  mongoose.connect(DB_MONGODB_URI as string, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
  })

  db = mongoose.connection

  db.on('error', console.error)
  db.once('open', () => {
    console.log('[db.js: Connected to the database]')
  })
} else if (DB_CONNECTION === 'mysql') {
  throw new Error('Database driver \'mysql\' not implemented yet.')
}

export default db