import 'reflect-metadata';

process.env.DATABASE_DRIVER = 'sqlite';
process.env.DATABASE_URI = ':memory:';
process.env.DATABASE_NAME = 'users-service';

const { orm } = await import('../src/start/database');

await orm
  .getSchemaGenerator()
  .refreshDatabase();
