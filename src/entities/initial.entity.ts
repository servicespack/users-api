import { configuration } from '../configuration';

import { MongoDBEntity } from './mongodb.entity';
import { RelationalEntity } from './relational.entity';

const { database: { driver } } = configuration;

export const InitialEntity = driver === 'mongo' ? MongoDBEntity : RelationalEntity;
