import { BaseEntity } from './base.entity';

export class User extends BaseEntity {
  name!: string;

  email!: string;

  emailVerificationKey = '';

  isEmailVerified = false;

  username!: string;

  password!: string;

  createdAt: Date = new Date();

  updatedAt: Date = new Date();
}
