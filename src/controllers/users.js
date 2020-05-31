const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')

// const mailer = require('../helpers/mailer')]

const User = mongoose.model('User')
const controllers = {}

controllers.list = async (request, response) => {
  const { page = 1, size = 10, search = '' } = request.query

  const query = {
    $or: [
      { 'name': new RegExp(search, 'gi') },
      { 'email': new RegExp(search, 'gi') },
      { 'username': new RegExp(search, 'gi') }
    ]
  }

  const [users, total] = await Promise.all([
    User
      .find(query)
      .skip((Number(page) - 1) * Number(size))
      .limit(Number(size)),
    User.countDocuments(query)
  ])

  return response.status(200).json({
    meta: {
      page: Number(page),
      size: Number(size),
      total
    },
    data: users
  })
}

controllers.show = async (request, response) => {
  const user = await User.findById(request.params.id)

  if (!user) {
    return response.status(404).json({
      error: 'User not found'
    })
  }

  return response.status(200).json(user)
}

controllers.create = async (request, response) => {
  const { name, email, username, password } = request.body

  const data = {
    name,
    email,
    username,
    password
  }

  const salt = bcrypt.genSaltSync(10)
  data.password = bcrypt.hashSync(data.password, salt)

  const newUser = new User(data)

  try {
    const user = await newUser.save()

    response.status(201).json(user)

    // await mailer.sendMail(user.email, 'Account Confirmation', generatedHtml)
  } catch (error) {
    return response.status(400).json({ error })
  }
}

controllers.update = async (request, response) => {
  const user = await User.findById(request.params.id)

  if (!user) {
    return response.status(404).json({
      error: 'User not found'
    })
  }

  const { name, email, username } = request.body

  user.name = name || user.name
  user.email = email || user.email
  user.username = username || user.username
  await user.save()

  return response.status(200).json(user)
}

controllers.delete = async (request, response) => {
  const user = await User.findById(request.params.id)

  if (!user) {
    return response.status(404).json({
      error: 'User not found'
    })
  }

  await user.delete()
  return response.status(204).json({})
}

module.exports = controllers
