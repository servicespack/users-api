import { plainToInstance } from 'class-transformer';

import { ConfigurationDto } from './dto/configuration.dto';

const {
  DATABASE_DRIVER,
  DATABASE_URI,
  DATABASE_NAME,
  HTTP_SERVER_PORT,
  NODE_ENV,
} = process.env;

const configuration = plainToInstance(ConfigurationDto, {
  environment: NODE_ENV || 'development',
  database: {
    driver: (DATABASE_DRIVER || 'sqlite') as any,
    uri: DATABASE_URI || './tmp',
    name: DATABASE_NAME || 'users-api',
  },
  servers: {
    http: {
      port: HTTP_SERVER_PORT || '3000',
    },
  },
} as ConfigurationDto);

export { configuration };
