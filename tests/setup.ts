import { MongoMemoryServer } from 'mongodb-memory-server'

import mongoose from 'mongoose'
import 'reflect-metadata'

const mongod = await MongoMemoryServer.create()
const uri = mongod.getUri()

process.env.DATABASE_URI = uri

await mongoose.connect(uri);

(globalThis as any).__MONGOD__ = mongod
