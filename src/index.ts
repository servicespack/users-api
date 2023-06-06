import 'reflect-metadata'

import { cooldown, orm } from './start'
import { server } from './http.server'
import { logger } from './logger'

const { APP_PORT = 3000 } = process.env

server.listen(APP_PORT, () => {
  logger.info(`Listening on ${APP_PORT}`)
})

cooldown({ server, orm })
