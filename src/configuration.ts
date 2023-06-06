import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import { ConfigurationDto } from './dto/configuration.dto';
import { logger } from './logger';

const {
  DATABASE_DRIVER,
  DATABASE_URI,
  DATABASE_NAME,
  HTTP_SERVER_PORT,
  NODE_ENV
} = process.env

const configuration = plainToInstance(ConfigurationDto, {
  environment: NODE_ENV || 'development',
  database: {
    driver: (DATABASE_DRIVER  || 'sqlite') as any,
    uri: DATABASE_URI || './tmp',
    name: DATABASE_NAME || 'users-api'
  },
  servers: {
    http: {
      port: HTTP_SERVER_PORT || '3000'
    }
  }
} as ConfigurationDto);

const errors = await validate(configuration);
if (errors.length) {
  logger.error(errors)
  process.exit(1)
}

export { configuration };
