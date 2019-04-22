const bodyParser = require('body-parser')
const express    = require('express')

const app = express()

// ---------- app Settings ----------
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))

// ---------- Object with the routers ----------
const router = {
  index: require('./src/routes/index'),
  users: require('./src/routes/users'),
  verifications: require('./src/routes/verifications'),
  auth: require('./src/routes/auth')
}

// ---------- routes Settings ----------
app.use('/', router.index)
app.use('/users', router.users)
app.use('/verifications', router.verifications)
app.use('/auth', router.auth)

const port = process.env.APP_PORT
app.listen(port, () => {
  console.log('[index.js: Listening on ' + port + ']')
})

module.exports = app
