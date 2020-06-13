'use strict'

const express = require('express')
const path = require('path')

const { db } = require('./start')
const app = require('./src/app')

const { APP_PORT } = process.env

app.use('/', express.static(path.join(__dirname, '/docs')))

const server = app.listen(APP_PORT, () => {
  console.log(`[index.js: Listening on ${APP_PORT}]`)
})

module.exports = {
  turnOff () {
    db.close()
    server.close()
  }
}
