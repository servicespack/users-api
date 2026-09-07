import { validate } from 'class-validator'

import { configuration, connectDatabase, cooldown, logger } from './config'
import { server } from './infrastructure/http/server'
import 'reflect-metadata'

async function main() {
  const errors = await validate(configuration)
  if (errors.length) {
    logger.error(errors)
    process.exit(1)
  }

  const { servers } = configuration

  await connectDatabase()

  server.listen(servers.http.port, () => {
    logger.info(`Listening on ${servers.http.port}`)
  })

  cooldown({ server })
}

main()
