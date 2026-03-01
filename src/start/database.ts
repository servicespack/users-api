import knex from 'knex';

import config from '../../knexfile';
import { logger } from '../logger';

const db = knex(config);

logger.info('Connected to the database');

export { db as knex };
