const bodyParser = require('body-parser')
const express = require('express')
const path = require('path')

const app = express()

// ---------- app Settings ----------
app.set('view engine', 'ejs') // Define ejs as view engine
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(express.static(path.join('public'))) // Use /public as the directory for public files

// ---------- Object with the routers ----------
const router = {
  index: require('./routes/index'),
  register: require('./routes/register'),
  newuser: require('./routes/newuser'),
  login: require('./routes/login'),
  api: require('./routes/api')
}

// ---------- routes Settings ----------
app.use('/', router.index)
app.use('/register', router.register)
app.use('/newuser', router.newuser)
app.use('/login', router.login)
app.use('/api', router.api)

module.exports = app
