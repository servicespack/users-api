import { MongoDBEntity } from './mongodb.entity'
import { RelationalEntity } from './relational.entity'
import { configuration } from '../configuration'

const { database: { driver } } = configuration;

export const InitialEntity = driver === 'mongo' ? MongoDBEntity : RelationalEntity
