const bodyParser = require('body-parser')
const cors = require('cors')
const express = require('express')

const app = express()

app.disable('x-powered-by')
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/api', require('./routes/index'))
app.use('/api/users', require('./routes/users'))
app.use('/api/tokens', require('./routes/tokens'))

const { APP_PORT } = process.env

app.listen(APP_PORT, () => {
  console.log('[app.js: Listening on ' + APP_PORT + ']')
})

module.exports = app
