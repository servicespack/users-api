import 'reflect-metadata';

process.env.DATABASE_DRIVER = 'sqlite';
process.env.DATABASE_URI = 'tmp/tests';
process.env.DATABASE_NAME = 'users-service';

async function setup() {
  const { orm } = await import('../src/start/database');

  await orm
    .getSchemaGenerator()
    .updateSchema();
}

setup();
