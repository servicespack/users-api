import { MongoMemoryServer } from 'mongodb-memory-server'

import mongoose from 'mongoose'
import { afterAll } from 'vitest'
import 'reflect-metadata'

const mongod = await MongoMemoryServer.create()
const uri = mongod.getUri()

process.env.DATABASE_URI = uri

await mongoose.connect(uri)

afterAll(async () => {
  await mongoose.disconnect()
  await mongod.stop()
})
