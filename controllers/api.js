const mongoose = require('mongoose')
const User = mongoose.model('User')

const blockedFields = require('../std').blockedFields

const getUsers = (req, res) => { // Return all public users
  const query = {
    private: false // Private user will not be returned
  }

  User.find(query, blockedFields, (err, users) => {
    if (err) {
      res.send(err)
    } else {
      res.json(users)
    }
  })
}

const getOneUser = (req, res) => { // Return just one user
  const query = {
    username: req.params.username // User with this username
  }

  User.findOne(query, blockedFields, (err, user) => {
    if (err) {
      res.send(err)
    } else {
      (user.private === true) ? res.send('Access denied! Private user.') : res.json(user)
    }
  })
}

module.exports = {
  getUsers,
  getOneUser
}
