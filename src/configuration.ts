import { plainToInstance } from 'class-transformer';

import { ConfigurationDto } from './dto/configuration.dto';

const {
  DATABASE_DRIVER,
  DATABASE_URI,
  DATABASE_URL,
  DATABASE_NAME,
  HTTP_SERVER_PORT,
  NODE_ENV,
  UPDATE_SCHEMA,
} = process.env;

const configuration = plainToInstance(ConfigurationDto, {
  environment: NODE_ENV || 'development',
  database: {
    driver: (DATABASE_DRIVER || 'sqlite'),
    uri: DATABASE_URL || DATABASE_URI || './tmp',
    name: DATABASE_NAME || 'users-service',
  },
  servers: {
    http: {
      port: HTTP_SERVER_PORT || '3000',
    },
  },
  updateSchema: UPDATE_SCHEMA === 'true',
} as ConfigurationDto);

export { configuration };
