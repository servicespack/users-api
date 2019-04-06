const dotenv = require('dotenv')
const result = dotenv.config({
  path: process.env.APP_ENV === 'test' ? '.env.test' : '.env'
})

if (result.error) {
  throw new Error(result.error)
}

require('./db')
require('./app')
