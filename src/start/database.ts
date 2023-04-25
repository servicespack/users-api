import { MikroORM } from '@mikro-orm/core'
import { type MongoDriver } from '@mikro-orm/mongodb'
import { User } from '../entities/user'

const {
  DATABASE_URI,
  DATABASE_NAME = 'users-api_db'
} = process.env

const orm = await MikroORM.init<MongoDriver>({
  entities: [User],
  clientUrl: DATABASE_URI,
  dbName: DATABASE_NAME,
  type: 'mongo'
})
console.log('[db.js: Connected to the database]')

export { orm }
