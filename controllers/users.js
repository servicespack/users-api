const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
const User = mongoose.model('User')

const controller = {}

controller.get = (req, res) => {
  console.log('GET /users')

  const query = {
    private: false
  }

  User.find(query, (err, users) => {
    if (err) {
      res.send(err)
    } else {
      res.json(users)
    }
  })
}

controller.post = (req, res) => {
  console.log('POST /users')

  const password = req.body.password
  const salt = bcrypt.genSaltSync(10)
  req.body.password = bcrypt.hashSync(password, salt)

  const newUser = new User(req.body)

  newUser.save((err, user) => {
    if (err) {
      res.send(err)
    } else {
      res.json(user)
    }
  })
}

module.exports = controller
