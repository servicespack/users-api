import { Entity, Property } from '@mikro-orm/core';

import { BaseEntity } from './base.entity';

@Entity()
export class User extends BaseEntity {
  @Property()
    name!: string;

  @Property()
    email!: string;

  @Property({ hidden: true })
    emailVerificationKey = '';

  @Property()
    isEmailVerified = false;

  @Property()
    username!: string;

  @Property({ hidden: true })
    password!: string;

  @Property({ hidden: true })
    createdAt: Date = new Date();

  @Property({ hidden: true, onUpdate: () => new Date() })
    updatedAt: Date = new Date();
}
