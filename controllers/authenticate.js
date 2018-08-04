const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
const User = mongoose.model('User')

const controller = {}

controller.post = async (req, res) => {
  const { username, password } = req.body
  const user = await User.findOne({ username }).select('+password')

  if (!user) {
    res.status(400)
    res.json({ error: 'User not found' })
  } else {
    if (!await bcrypt.compare(password, user.password)) {
      res.status(400)
      res.json({ error: 'Invalid password' })
    } else {
      res.json({ user })
    }
  }
}

module.exports = controller
