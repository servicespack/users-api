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
      res.status(400)
      res.json({ err })
    } else {
      res.status(200)
      res.json(users)
    }
  })
}

controller.post = (req, res) => {
  console.log('POST /users')

  const data = {
    name: req.body.name,
  }
  const password = req.body.password
  const salt = bcrypt.genSaltSync(10)
  req.body.password = bcrypt.hashSync(password, salt)

  const newUser = new User(req.body)
  newUser.name = req.body.name
  newUser.birthday = req.body.birthday
  newUser.email = req.body.email

  newUser.save((err, user) => {
    if (err) {
      res.status(400)
      res.json({ err })
    } else {
      res.status(200)
      res.json(user)
    }
  })
}

module.exports = controller
