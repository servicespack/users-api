const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name: String,
	birthday: Date,
	email: String,
	private: Boolean,
	username: String,
	password: String  
})

const User = mongoose.model('User', userSchema)
module.exports = User
