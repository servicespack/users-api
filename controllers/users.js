const mongoose = require('mongoose')
const User = mongoose.model('User')

const controller = {}

controller.get = (req, res) => {
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
  const newUser = new User({
    name: req.body.name,
    birthday: req.body.birthday,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password
  })

  newUser.save((err, user) => {
    if (err) {
      res.send(err)
    } else {
      res.json(user)
    }
  })
}

module.exports = controller
