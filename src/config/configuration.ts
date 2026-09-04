import { plainToInstance } from 'class-transformer'

import { ConfigurationDto } from '../dto/configuration.dto'

const {
  DATABASE_URI,
  HTTP_SERVER_PORT,
  NODE_ENV,
  TOKEN_SECRET,
  TOKEN_EXPIRATION,
} = process.env

const configuration = plainToInstance(ConfigurationDto, {
  environment: NODE_ENV || 'development',
  database: {
    uri: DATABASE_URI || 'mongodb://localhost:27017/users-service',
  },
  servers: {
    http: {
      port: HTTP_SERVER_PORT || '3000',
    },
  },
  auth: {
    jwtSecret: TOKEN_SECRET || 'abcdef',
    jwtExpiration: TOKEN_EXPIRATION || '60',
  },
} as ConfigurationDto)

export { configuration }
