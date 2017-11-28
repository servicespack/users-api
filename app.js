const express = require('express')
const fs = require('fs')
const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/boxusers')
const db = mongoose.connection
db.on('error', console.error.bind(console, 'Erro na conexão do banco de dados'))
db.once('open', () => {
	const userSchema = mongoose.Schema({
		name: String,
		age: Number,
		email: String
	})

	User = mongoose.model('User', userSchema)
})

const app = express()

app.all('/', (req, res) => {
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

	//Em manutenção

	res.send('Em manutenção')

	const newUser = {
		name: req.param('name'),
		email: req.param('email'),
		age: req.param('age')
	}

	new User(newUser).save((err) => {
		if(err) {
			res.send('erro')
		} else {
			res.send('funcionou')
		}
	})
})


const port = 3000
app.listen(port, () => {
	console.log("Listening on", port)
})