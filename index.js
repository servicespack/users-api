const app = require('./app')
const db = require('./db')
const fs = require('fs')
const functions = require('./functions/functions.js')
const validator = require('validator')

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

	const newUser = new db.User({
		name: req.param('name'),
		birthday: req.param('birthday'),
		// age: functions.age(...);
		email: req.param('email'),
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
	db.User.find({private: false}, (err, users) => {
		if (!err)
			res.json(users)
		else
			res.send(err)
	})
})

app.get('/API/:username', (req, res) => {
	username = req.param('username')
	
	db.User.findOne({'username': username}, (err, user) => {
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