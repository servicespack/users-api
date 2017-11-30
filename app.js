const bodyParser = require('body-parser')
const express = require('express')
const fs = require('fs')
const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/boxusers')
const db = mongoose.connection
db.on('error', console.error.bind(console, 'Erro na conexão do banco de dados'))
db.once('open', () => {
	const userSchema = mongoose.Schema({
		name: String,
		email: String, // Validar
		birth: {
			month: Number,
			day: Number,
			year: Number
		} //Validar.
	})

	User = mongoose.model('User', userSchema)
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

	// res.send(req.params):

	const newUser = {
		name: req.param('name'),
		email: req.param('email'),
		birth: {
			month: req.param('month'),
			day: req.param('day'),
			year: req.param('year')
		}
	}

	new User(newUser).save((err, user) => {
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

const port = 3000
app.listen(port, () => {
	console.log("Listening on", port)
})