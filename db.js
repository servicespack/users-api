const mongoose = require('mongoose')

const uri = 'mongodb://localhost/ubox'
mongoose.connect(uri, (err) => {
	if (err)
		console.log("[db.js: Erro ao conectar à " + uri + ": " + err + "]")
	else
		console.log("[db.js: Conexão à " + uri + " estabelecida]")
})

const db = mongoose.connection
db.on('error', console.error)
db.once('open', () => {
	console.log("[db.js: Connected to the database]")

	const userSchema = mongoose.Schema({
		name: String,
		birthday: Date,
		age: Number,
		email: String, // Validar
		private: Boolean,
		username: String,
		password: String
	})

	exports.User = mongoose.model('User', userSchema)
})
