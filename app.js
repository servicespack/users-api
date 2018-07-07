const bodyParser = require('body-parser')
const express = require('express')

const app = express()

// ---------- app Settings ----------
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))
app.set('json spaces', 2)

// ---------- Object with the routers ----------
const router = {
  index: require('./routes/index'),
  users: require('./routes/users')
}

// ---------- routes Settings ----------
app.use('/', router.index)
app.use('/users', router.users)

module.exports = app
