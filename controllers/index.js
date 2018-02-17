const fs = require('fs')

module.exports = (req, res) => {
    fs.readFile('public/index.html', (err, data) => {
		if (err)
			res.send(err)
		else
			res.send(data)
    })
}