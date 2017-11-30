const bodyParser = require('body-parser')
const express = require('express')
const fs = require('fs')
const mongoose = require('mongoose')

const db = mongoose.connection
db.on('error', console.error)
db.once('open', () => {
	console.log("[Connected to the database]")

	const userSchema = mongoose.Schema({
		name: String,
		email: String, // Validar
		birth: Date,
		private: Boolean,
		username: String,
		password: String
	})

	User = mongoose.model('User', userSchema)
})

mongoose.connect('mongodb://localhost/boxusers', (err) => {
	console.log("Erro na conectar ao banco de dados", err)
})

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
	extended: true
}))

app.get('/', (req, res) => {
	fs.readFile('sources/index.html', 'utf-8', (err, data) => {
		if (err)
			res.send(err)
		else
			res.send(data)
	})
})

app.get('/register', (req, res) => {
	fs.readFile('sources/register.html', 'utf-8', (err, data) => {
		if (err)
			res.send(err)
		else
			res.send(data)
	})
})


app.post('/validator', (req, res) => {

	const newUser = new User({
		name: req.param('name'),
		email: req.param('email'),
		birth: req.param('birth'),
		private: (req.param('privacy') === 'private')?true:false,
		username: req.param('username'),
		password: req.param('password') 
	})

	newUser.save((err, user) => {
		if(err) {
			res.send(err)
		} else {
			res.json(user)
		}
	})
})

app.get('/login', (req, res) => {
	fs.readFile('sources/login.html', 'utf-8', (err, data) => {
		if (err)
			res.send(err)
		else 
			res.send(data)
	})
})

app.get('/wait', (req, res) => {
	res.send('Tratar login')	
})

app.get('/API', (req, res) => {
	User.find({private: false}, (err, users) => {
		if (!err)
			res.json(users)
		else
			res.send('Erro')
	})
})


app.get('/API/:username', (req, res) => {
	Username = req.param('username')
	
	User.find({'username': Username}, (err, user) => {
		if (user[0].private === false)
			res.json(user)
		else
			res.send('Private user')
	})
})

const port = 3000
app.listen(port, () => {
	console.log("Listening on", port)
})