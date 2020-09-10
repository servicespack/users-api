'use strict'

const EventEmitter = require('events')

class UserEmitter extends EventEmitter {}

module.exports = new UserEmitter()
