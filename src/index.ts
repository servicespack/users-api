import 'reflect-metadata';

import { validate } from 'class-validator';

import { configuration } from './configuration';
import { server } from './http.server';
import { logger } from './logger';
import { cooldown, connectDatabase } from './start';

async function main() {
  const errors = await validate(configuration);
  if (errors.length) {
    logger.error(errors);
    process.exit(1);
  }

  const { servers } = configuration;

  await connectDatabase();

  server.listen(servers.http.port, () => {
    logger.info(`Listening on ${servers.http.port}`);
  });

  cooldown({ server });
}

main();
