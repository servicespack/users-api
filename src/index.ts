import 'reflect-metadata'

import { configuration } from './configuration'
import { cooldown, orm } from './start'
import { server } from './http.server'
import { logger } from './logger'

const { servers } = configuration

server.listen(servers.http.port, () => {
  logger.info(`Listening on ${servers.http.port}`)
})

cooldown({ server, orm })
