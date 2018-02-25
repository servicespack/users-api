const app = require('./app')
const db = require('./db')

const port = process.env.PORT || 3000 // Define the port
app.listen(port, () => {
	console.log("[index.js: Listening on " + port + "]")
})
