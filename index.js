require('dotenv').config() // Load environment variables
require('./db') // Start database and load models

const app = require('./app')

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log('[index.js: Listening on ' + port + ']')
})
