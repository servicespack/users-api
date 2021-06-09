'use strict'

const bcrypt = require('bcryptjs')
const cryptoRandomString = require('crypto-random-string')
const mongoose = require('mongoose')
const xss = require('xss')

const UserEmitter = require('../emitters/UserEmitter')

const User = mongoose.model('User')
const salt = bcrypt.genSaltSync(10)
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
      pages: Math.ceil(total / Number(size)),
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
    name: xss(name),
    email: xss(email),
    username: xss(username),
    password,
    email_verification_key: cryptoRandomString({length: 128})
  }

  data.password = bcrypt.hashSync(data.password, salt)

  const newUser = new User(data)

  try {
    const {
      _id,
      name,
      email,
      username,
      email_verification_key: emailVerificationKey
    } = await newUser.save()

    response.status(201).json({
      _id,
      name,
      email,
      username
    })

    UserEmitter.emit('create', {
      _id,
      name,
      email,
      username,
      emailVerificationKey
    })
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

controllers.updatePassword = async (request, response) => {
  const user = await User
    .findById(request.params.id)
    .select('+password')

  if (!user) {
    return response.status(404).json({
      error: 'User not found'
    })
  }

  const {
    current_password: currentPassword,
    new_password: newPassword
  } = request.body

  const correctPassword = await bcrypt.compare(currentPassword, user.password)
  if (!correctPassword) {
    return response.status(401).json({ error: 'Invalid password' })
  }

  user.password = bcrypt.hashSync(newPassword, salt)

  await user.save()

  return response.status(200).json({
    message: 'Password updated'
  })
}

controllers.delete = async (request, response) => {
  const user = await User.findById(request.params.id)

  if (!user) {
    return response.status(404).json({
      error: 'User not found'
    })
  }

  await user.delete()
  UserEmitter.emit('delete', user)

  return response.status(204).json({})
}

module.exports = controllers
