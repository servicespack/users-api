import { randomUUID } from 'node:crypto';

import { PrimaryKey } from '@mikro-orm/core';

export class BaseEntity {
    @PrimaryKey()
      id: string = randomUUID();
}
