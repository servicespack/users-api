import 'reflect-metadata';

process.env.DATABASE_DRIVER = 'sqlite';
process.env.DATABASE_URI = ':memory:';
process.env.DATABASE_NAME = 'users-service';

const { knex } = await import('../src/start/database');

await knex.migrate.latest();
