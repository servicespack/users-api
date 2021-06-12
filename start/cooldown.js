'use strict'

const cooldown = ({ server, db }) => {
  const close = code => () => {
    server.close(() => {
      db.close()
      process.exit(code)
    })
  }

  process.on('SIGHUP', close(128 + 1))
  process.on('SIGINT', close(128 + 2))
  process.on('SIGTERM', close(128 + 15))
}

module.exports = cooldown
