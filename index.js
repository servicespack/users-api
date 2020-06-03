const express = require('express')
const path = require('path')

require('./start')
const app = require('./src/app')

app.use('/', express.static(path.join(__dirname, '/docs')))
