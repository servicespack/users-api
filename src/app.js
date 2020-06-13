'use strict'

const bodyParser = require('body-parser')
const cors = require('cors')
const express = require('express')
const helmet = require('helmet')

const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(helmet())

app.use('/api', require('./routes/index'))
app.use('/api/users', require('./routes/users'))
app.use('/api/tokens', require('./routes/tokens'))
app.use('/api/verifications', require('./routes/verifications'))

module.exports = app
