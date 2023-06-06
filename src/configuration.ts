import { validateOrReject } from 'class-validator';
import { plainToInstance } from 'class-transformer';

import { ConfigurationDto } from './dto/configuration.dto';

const configuration: ConfigurationDto = {
  database: {
    driver: (process.env.DATABASE_DRIVER  || 'sqlite') as any,
    uri: process.env.DATABASE_URI || './tmp',
    name: process.env.DATABASE_NAME || 'users-api'
  },
};

await validateOrReject(plainToInstance(ConfigurationDto, configuration));

export { configuration };
