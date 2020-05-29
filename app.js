const bodyParser = require('body-parser')
const express = require('express')
const path = require('path')

const app = express()

app.disable('x-powered-by')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/', express.static(path.join(__dirname, '/docs')))
app.use('/api', require('./src/routes/index'))
app.use('/api/users', require('./src/routes/users'))
app.use('/api/verifications', require('./src/routes/verifications'))
app.use('/api/tokens', require('./src/routes/tokens'))

const { APP_PORT } = process.env

app.listen(APP_PORT, () => {
  console.log('[index.js: Listening on ' + APP_PORT + ']')
})

module.exports = app
