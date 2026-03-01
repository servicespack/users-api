import { randomUUID } from 'node:crypto';

export class BaseEntity {
  id: string = randomUUID();
}
