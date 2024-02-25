import pino from 'pino';

import { configuration } from './configuration';

const { environment } = configuration;

export const options = {
  transport: environment === 'development'
    ? { target: 'pino-pretty' }
    : undefined,
};

export const logger = pino(options);
