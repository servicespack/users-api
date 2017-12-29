const app = require('./app')
const fs = require('fs')
const functions = require('./functions/functions.js')
const mongoose = require('mongoose')
const validator = require('validator')

const db = mongoose.connection
db.on('error', console.error)
db.once('open', () => {
	console.log("[index.js: Connected to the database]")

	const userSchema = mongoose.Schema({
		name: String,
		email: String, // Validar
		birth: Date,
		age: Number,
		private: Boolean,
		username: String,
		password: String
	})

	User = mongoose.model('User', userSchema)
})

const uri = 'mongodb://localhost/boxusers'
mongoose.connect(uri, (err) => {
	if (err)
		console.log("[mongoose: Erro ao conectar à " + uri + ": " + err + "]")
	else
		console.log("[mongoose: Conexão à " + uri + " estabelecida]")
})

app.get('/', (req, res) => {
	fs.readFile('public/index.html', 'utf-8', (err, data) => {
		if (err)
			res.send(err)
		else
			res.send(data)
	})
})

app.get('/register', (req, res) => {
	fs.readFile('public/register.html', 'utf-8', (err, data) => {
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
		// age: functions.age(...);
		private: (req.param('privacy') === 'private')?true:false,
		username: req.param('username'),
		password: req.param('password')
	})

	/*	Erros ainda não encontrados.
	// ------------------- Inspection -------------------

	var warnings = []

	User.findOne({'email': newUser.email}, (err, user) => {
		if (!err)
			if (Object.keys(user).length) {
				warnings.push('E-mail')
			}
		else
			console.log(err)
	})

	User.findOne({'username': newUser.username}, (err, user) => {
		if (!err)
			if (Object.keys(user).length) {
				warnings.push('Username')
			}
		else
			console.log(err)

	if (warnings.length)
		res.json(warnings)
	})

	// --------------------------------------------------
	*/

	newUser.save((err, user) => {
		if(err) {
			res.send(err)
		} else {
			res.json(user)
		}
	})
})

//Implementar atualização de usuários

app.get('/login', (req, res) => {
	fs.readFile('public/login.html', 'utf-8', (err, data) => {
		if (err)
			res.send(err)
		else 
			res.send(data)
	})
})

app.get('/API', (req, res) => {
	User.find({private: false}, (err, users) => {
		if (!err)
			res.json(users)
		else
			res.send(err)
	})
})

app.get('/API/:username', (req, res) => {
	username = req.param('username')
	
	User.findOne({'username': username}, (err, user) => {
		if (!err)
			(user.private ==- true)?res.send('Private user'):res.json(user)
		else
			res.send(err)
	})
})

const port = process.env.PORT || 3000
app.listen(port, () => {
	console.log("[index.js: Listening on " + port + "]")
})