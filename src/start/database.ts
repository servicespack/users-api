import { type Connection, type IDatabaseDriver, MikroORM, type Options } from '@mikro-orm/core'
import { User } from '../entities/user'
import { logger } from '../logger'

const {
  DATABASE_DRIVER = 'sqlite',
  DATABASE_URI,
  DATABASE_NAME = 'users-api_db'
} = process.env

const config: Options<IDatabaseDriver<Connection>> = {
  entities: [User],
  clientUrl: DATABASE_DRIVER !== 'sqlite'
    ? DATABASE_URI
    : undefined,
  dbName: DATABASE_NAME,
  type: DATABASE_DRIVER as 'mongo' | 'sqlite',
  debug: true
}
const orm = await MikroORM.init(config)
logger.info('Connected to the database')

const generator = orm.getSchemaGenerator()
await generator.updateSchema()

export { config, orm }
