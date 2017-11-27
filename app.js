const express = require('express')
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

app.get('/', (req, res) => {
	res.send('Server ON!')
})


const port = 3000
app.listen(port, () => {
	console.log("Listening on", port)
})