const mongoose = require('mongoose')
const User = require('../models/user')

module.exports = (req, res) => {
    const newUser = new User({
		name: req.body.name,
        birthday: req.body.birthday,
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
			res.render('error')
		else
			res.render('registered')
	})
}