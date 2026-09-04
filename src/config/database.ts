import mongoose from 'mongoose'

import { userValidationRules } from '../infrastructure/database/mongoose/models/user.model'
import { configuration } from './configuration'
import { logger } from './logger'

const { database } = configuration

export async function connectDatabase(): Promise<typeof mongoose> {
  const connection = await mongoose.connect(database.uri)
  logger.info('Connected to the database')

  const { db } = connection.connection

  if (!db) {
    throw new Error('Database connection not established')
  }

  const collections = await db.listCollections({ name: 'users' }).toArray()

  if (collections.length > 0) {
    await db.command({ collMod: 'users', validator: userValidationRules })
  }
  else {
    await db.createCollection('users', { validator: userValidationRules })
  }

  logger.info('Schema validation applied to users collection')

  return connection
}
