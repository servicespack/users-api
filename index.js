'use strict'

const { cooldown, db } = require('./start')
const app = require('./src/app')

const { APP_PORT } = process.env

const server = app.listen(APP_PORT, () => {
  console.log(`[index.js: Listening on ${APP_PORT}]`)
})

cooldown({ server, db })

module.exports = {
  turnOff () {
    db.close()
    server.close()
  }
}
