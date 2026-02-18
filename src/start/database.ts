import path from 'node:path';

import { defineConfig, MikroORM } from '@mikro-orm/core';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { SqliteDriver } from '@mikro-orm/sqlite';

import { configuration } from '../configuration';
import { User } from '../entities/user';
import { logger } from '../logger';

const { database } = configuration;

const isSqlite = database.driver === 'sqlite';
const isMemory = database.uri === ':memory:';

const sqliteDbName = isMemory
  ? ':memory:'
  : path.join(database.uri, `${database.name}.sqlite`);

const dbName = isSqlite ? sqliteDbName : database.name;

const config = defineConfig({
  clientUrl: !isSqlite ? database.uri : undefined,
  dbName,
  entities: [User],
  driver: SqliteDriver,
  metadataProvider: TsMorphMetadataProvider,
  debug: true,
});

const orm = MikroORM.initSync(config);
logger.info('Connected to the database');

export { config, orm };
