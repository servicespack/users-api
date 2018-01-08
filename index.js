const app = require('./app')
const db = require('./db')
const fs = require('fs')
const std = require('./std')
const validator = require('validator')

app.get('/', (req, res) => {
	fs.readFile('public/index.html', (err, data) => {
		if (err)
			res.send(err)
		else
			res.send(data)
	})
})

app.get('/register', (req, res) => {
	fs.readFile('public/register.html', 'utf8', (err, data) => {
		if (err)
			res.send(err)
		else
			res.send(data)
	})
})

app.post('/newuser', (req, res) => {

	const newUser = new db.User({
		name: req.body.name,
		birthday: req.body.birthday,
		// age: functions.calcAge(req.param('birthday'), Date()),
		email: req.body.email,
		private: (req.body.privacy === 'private')?true:false,
		username: req.body.username,
		password: req.body.password
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
		if(err)
			fs.readFile('public/error.html', 'utf8', (err, data) => {
				if (err)
					res.send(err)
				else
					res.send(data)
			})
		else
			fs.readFile('public/registered.html', 'utf8', (err, data) => {
				if (err)
					res.send(err)
				else
					res.send(data)
			})
	})
})

//Implementar atualização de usuários (Exige login ok!)

app.get('/login', (req, res) => {
	fs.readFile('public/login.html', 'utf8', (err, data) => {
		if (err)
			res.send(err)
		else 
			res.send(data)
	})
})

app.post('/wait', (req, res) => {
	const query = {
		username: req.body.username,
		password: req.body.password
	}

	db.User.findOne(query, (err, user) => {
		if (err)
			res.send(err)
		else
			if (user)
				res.json(user)
			else
				res.send('Access denied!')
	})
})

app.get('/users', (req, res) => {
	const query = {
		private: false
	}

	db.User.find(query, std.blockedFields, (err, users) => {
		if (err)
			res.send(err)
		else
			res.json(users)
	})
})

app.get('/users/:username', (req, res) => {
	const query = {
		username: req.params.username
	}
	
	db.User.findOne(query, std.blockedFields, (err, user) => {
		if (err)
			res.send(err)
		else
			(user.private === true)?res.send('Access denied! Private user.'):res.json(user)
	})
})

const port = process.env.PORT || 3000
app.listen(port, () => {
	console.log("[index.js: Listening on " + port + "]")
})