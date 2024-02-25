export default () => {
  process.env.DATABASE_DRIVER = 'sqlite';
  process.env.DATABASE_URI = 'tmp/tests';
  process.env.DATABASE_NAME = 'users-api';
};
