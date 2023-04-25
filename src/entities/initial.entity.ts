import { MongoDBEntity } from './mongodb.entity'
import { RelationalEntity } from './relational.entity'

const {
  DATABASE_DRIVER = 'sqlite'
} = process.env

export const InitialEntity = DATABASE_DRIVER === 'mongodb' ? MongoDBEntity : RelationalEntity
