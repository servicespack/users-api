const fs = require('fs')

module.exports = (req, res) => {
	fs.readFile('public/login.html', 'utf8', (err, data) => {
		if (err)
			res.send(err)
		else 
			res.send(data)
	})
}
