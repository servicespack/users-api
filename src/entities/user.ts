import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { SoftDeletable } from 'mikro-orm-soft-delete';

@SoftDeletable(() => User, 'deletedAt', () => new Date())
@Entity()
export class User {
  @PrimaryKey()
  id!: number;

  @Property()
  name!: string;

  @Property()
  email!: string;
  
  @Property()
  emailVerificationKey!: string;

  @Property()
  isEmailVerified!: boolean;

  @Property()
  username!: string;

  @Property({ hidden: true })
  password!: string;

  @Property({ hidden: true })
  createdAt: Date = new Date();

  @Property({ hidden: true, onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @Property({ hidden: true, nullable: true })
  deletedAt!: Date | null;
}