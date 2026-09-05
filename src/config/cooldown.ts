import type http from 'node:http'

import mongoose from 'mongoose'

import { logger } from './logger'

function cooldown({ server }: {
  server: http.Server
}): void {
  const close = (code: number) => () => {
    server.close(() => {
      mongoose.disconnect().then(() => process.exit(code)).catch(error => logger.error(error))
    })
  }

  process.on('SIGHUP', close(128 + 1))
  process.on('SIGINT', close(128 + 2))
  process.on('SIGTERM', close(128 + 15))
}

export default cooldown
