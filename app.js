const bodyParser = require('body-parser')
const express = require('express')

const app = express()

app.disable('x-powered-by')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/', require('./src/routes/index'))
app.use('/users', require('./src/routes/users'))
app.use('/verifications', require('./src/routes/verifications'))
app.use('/auth', require('./src/routes/auth'))

const { APP_PORT } = process.env

app.listen(APP_PORT, () => {
  console.log('[index.js: Listening on ' + APP_PORT + ']')
})

module.exports = app
