const bodyParser = require('body-parser')
const express = require('express')

const app = express()

app.set('view engine', 'ejs')

app.use(express.static(__dirname + '/public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
	extended: true
}))

// Routes
const router = {
	index: require('./routes/index'),
	register: require('./routes/register'),
	newuser: require('./routes/newuser'),
	login: require('./routes/login'),
	api: require('./routes/api')
}

app.use('/', router.index)
app.use('/register', router.register)
app.use('/newuser', router.newuser)
app.use('/login', router.login)
app.use('/api', router.api)

module.exports = app
