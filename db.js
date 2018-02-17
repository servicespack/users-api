const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/ubox', (err) => {
	if (err)
		console.log("[db.js: Erro na conexão com o banco de dados]")
})

const db = mongoose.connection
db.on('error', console.error)
db.once('open', () => {
	console.log("[db.js: Connected to the database]")
})
