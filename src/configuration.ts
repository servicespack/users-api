import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

import { ConfigurationDto } from './dto/configuration.dto';
import { logger } from './logger';

const {
  DATABASE_DRIVER,
  DATABASE_URI,
  DATABASE_NAME
} = process.env

const configuration = plainToInstance(ConfigurationDto, {
  database: {
    driver: (DATABASE_DRIVER  || 'sqlite') as any,
    uri: DATABASE_URI || './tmp',
    name: DATABASE_NAME || 'users-api'
  },
} as ConfigurationDto);

const errors = await validate(configuration);
if (errors.length) {
  logger.error(errors)
  process.exit(1)
}

export { configuration };
