import { randomUUID } from 'node:crypto';

import { PrimaryKey } from '@mikro-orm/core';

export class RelationalEntity {
  @PrimaryKey()
    id: string = randomUUID();
}
