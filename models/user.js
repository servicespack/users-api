const mongoose = require('mongoose')

const userSchema = mongoose.Schema({ // Required fields for a user
    name: String,
	birthday: Date,
	email: String,
	private: Boolean,
	username: String,
	password: String  
})

const User = mongoose.model('User', userSchema) // Bind userSchema with the User model
module.exports = User
