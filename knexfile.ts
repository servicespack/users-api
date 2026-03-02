import 'reflect-metadata';
import path from 'node:path';

import { configuration } from './src/configuration';

const { database } = configuration;

const isSqlite = database.driver === 'sqlite';

const config = {
  client: isSqlite ? 'sqlite3' : 'pg',
  connection: isSqlite
    ? { filename: database.uri === ':memory:' ? ':memory:' : path.join(database.uri, `${database.name}.sqlite`) }
    : database.uri,
  migrations: {
    directory: path.join(__dirname, 'src', 'migrations'),
    extension: 'ts',
    loadExtensions: ['.ts'],
  },
  useNullAsDefault: isSqlite,
};

export default config;
