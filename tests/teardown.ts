import fs from 'node:fs/promises';
import path from 'node:path';

export default async () => {
  await fs.rm(path.join(__dirname, '..', 'tmp', 'tests', 'users-api.sqlite'));
};
