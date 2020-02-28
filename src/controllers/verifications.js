const mongoose = require('mongoose')

const Verification = mongoose.model('Verification')
const controllers = {}

controllers.patch = (req, res) => {
  console.log(Verification)
  return res.status(201).json({ hello: 'world' })
}

module.exports = controllers
