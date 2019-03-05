const bcrypt   = require('bcryptjs')
const mongoose = require('mongoose')
const User     = mongoose.model('User')

const controller = {}

controller.get = (req, res) => {
  console.log('GET /users')

  const query = {}

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

controller.post = async (req, res) => {
  console.log('POST /users')

  const data = {} // Will receive all the valid user's data

  /**
   * User's data without validation
   */
  data.name = req.body.name // GET the User's name
  data.birthday = req.body.birthday // GET the User's birthday

  /**
   * Email validation
   */
  const email = req.body.email // GET the User's email
  data.email = email

  /**
   * Username validation
   */
  const username = req.body.username
  data.username = username // GET the User's username

  /**
   * Password validation
   */
  const password = req.body.password // GET the User's password
  const salt = bcrypt.genSaltSync(10)
  data.password = bcrypt.hashSync(password, salt)

  const newUser = new User(data)
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
