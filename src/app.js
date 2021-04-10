'use strict'

const cors = require('cors')
const express = require('express')
const helmet = require('helmet')

const app = express()

app.use(cors())
app.use(express.json())
app.use(helmet())

app.use('/api', require('./routes/index'))
app.use('/api/users', require('./routes/users'))
app.use('/api/tokens', require('./routes/tokens'))
app.use('/api/verifications', require('./routes/verifications'))

require('./listeners')

module.exports = app
