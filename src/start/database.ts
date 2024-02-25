import path from 'node:path';

import {
  type Connection, type IDatabaseDriver, type Options, MikroORM,
} from '@mikro-orm/core';

import { configuration } from '../configuration';
import { User } from '../entities/user';
import { logger } from '../logger';

const { database } = configuration;

const config: Options<IDatabaseDriver<Connection>> = {
  entities: [User],
  clientUrl: database.driver !== 'sqlite'
    ? database.uri
    : undefined,
  dbName: database.driver === 'sqlite'
    ? path.join(database.uri, `${database.name}.sqlite`)
    : database.name,
  type: database.driver,
  debug: true,
};
const orm = await MikroORM.init(config);
logger.info('Connected to the database');

const generator = orm.getSchemaGenerator();
await generator.updateSchema();

export { config, orm };
