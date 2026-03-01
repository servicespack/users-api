import type http from 'node:http';

import { type Knex } from 'knex';

import { logger } from '../logger';

const cooldown = ({ server, knex }: {
  knex: Knex
  server: http.Server
}): void => {
  const close = (code: number) => () => {
    server.close(() => {
      knex.destroy().then(() => process.exit(code)).catch(logger.error);
    });
  };

  process.on('SIGHUP', close(128 + 1));
  process.on('SIGINT', close(128 + 2));
  process.on('SIGTERM', close(128 + 15));
};

export default cooldown;
