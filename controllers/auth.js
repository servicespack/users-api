const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = mongoose.model('User')

const controller = {}
const secret = process.env.SECRET

controller.post = async (req, res) => {
  const { username, password } = req.body
  const user = await User.findOne({ username }).select('+password')

  if (!user) {
    return res.status(400).json({ error: 'User not found' })
  }

  const correctPassword = await bcrypt.compare(password, user.password)
  if (!correctPassword) {
    return res.status(400).json({ error: 'Invalid password' })
  }

  const token = jwt.sign({ id: user.id }, secret, { expiresIn: 10 })

  return res.status(200).json({ user, token })
}

module.exports = controller
