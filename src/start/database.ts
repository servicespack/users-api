import { MikroORM } from "@mikro-orm/core";
import { MongoDriver } from "@mikro-orm/mongodb";

const {
  DATABASE_URI,
  DATABASE_NAME = 'users-api_db'
} = process.env

const orm = await MikroORM.init<MongoDriver>({
  entities: ['./dist/entities'],
  entitiesTs: ['./src/entities'],
  clientUrl: DATABASE_URI,
  dbName: DATABASE_NAME,
  type: 'mongo',
});
console.log('[db.js: Connected to the database]')

export { orm }

