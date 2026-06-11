import 'reflect-metadata';

import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

const mongod = await MongoMemoryServer.create();
const uri = mongod.getUri();

process.env.DATABASE_URI = uri;

await mongoose.connect(uri);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).__MONGOD__ = mongod;
