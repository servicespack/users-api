const std = require('../std')
const User = require('../models/user')

const allUsers = (req, res) => {
    const query = {
		private: false
	}

	User.find(query, std.blockedFields, (err, users) => {
		if (err)
			res.send(err)
		else
			res.json(users)
	})
}

const thisUser = (req, res) => {
	const query = {
		username: req.params.username
	}
	
	User.findOne(query, std.blockedFields, (err, user) => {
		if (err)
			res.send(err)
		else
			(user.private === true)?res.send('Access denied! Private user.'):res.json(user)
	})
}

module.exports = {
	allUsers,
	thisUser
}