const dotenv = require('dotenv')
const result = dotenv.config()

if (result.error) {
  throw new Error(result.error)
}

require('./db')
require('./app')
