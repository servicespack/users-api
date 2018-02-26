const blockedFields = require('../std').blockedFields
const User = require('../models/user') // Importing user model

const allUsers = (req, res) => {
    const query = {
		private: false // Just public users will be returned
	}

	User.find(query, blockedFields, (err, users) => {
		if (err)
			res.send(err)
		else
			res.json(users)
	})
}

const thisUser = (req, res) => {
	const query = {
		username: req.params.username // Just one user, with this username, will be returned.
	}
	
	User.findOne(query, std.blockedFields, (err, user) => {
		if (err)
			res.send(err)
		else
			(user.private === true)?res.send('Access denied! Private user.'):res.json(user) // If the user is private, the access is denied.
	})
}

module.exports = {
	allUsers,
	thisUser
}