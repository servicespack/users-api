import 'reflect-metadata';

import { validate } from 'class-validator';

import { configuration } from './configuration';
import { server } from './http.server';
import { logger } from './logger';
import { cooldown, orm } from './start';

async function main() {
  const errors = await validate(configuration);
  if (errors.length) {
    logger.error(errors);
    process.exit(1);
  }

  const { servers, updateSchema } = configuration;

  server.listen(servers.http.port, () => {
    logger.info(`Listening on ${servers.http.port}`);
  });

  if (updateSchema) {
    await orm.schema.updateSchema();
  }

  cooldown({ server, orm });
}

main();
