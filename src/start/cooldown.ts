import type http from 'node:http';

import type { MikroORM } from '@mikro-orm/core';

const cooldown = ({ server, orm }: {
  orm: MikroORM
  server: http.Server
}): void => {
  const close = (code: number) => () => {
    server.close(() => {
      orm.close().then(() => process.exit(code)).catch(console.error);
    });
  };

  process.on('SIGHUP', close(128 + 1));
  process.on('SIGINT', close(128 + 2));
  process.on('SIGTERM', close(128 + 15));
};

export default cooldown;
