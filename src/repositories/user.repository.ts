import { type Knex } from 'knex';

import { type User } from '../entities/user';

export class UserRepository {
  private static readonly TABLE_NAME = 'users';

  // eslint-disable-next-line no-useless-constructor
  constructor(private readonly knex: Knex) { }

  private get query() {
    return this.knex<User>(UserRepository.TABLE_NAME);
  }

  async find(search: string, options: { offset: number, limit: number }) {
    let q = this.query.select('*');

    if (search !== '') {
      q = q.where(function () {
        this.where('name', 'like', `%${search}%`)
          .orWhere('email', 'like', `%${search}%`)
          .orWhere('username', 'like', `%${search}%`);
      });
    }

    const users = await q.offset(options.offset).limit(options.limit);

    return users.map((user) => ({
      ...user,
      isEmailVerified: Boolean(user.isEmailVerified),
      createdAt: new Date(user.createdAt),
      updatedAt: new Date(user.updatedAt),
    }));
  }

  async count(search: string): Promise<number> {
    let q = this.query;

    if (search !== '') {
      q = q.where(function () {
        this.where('name', 'like', `%${search}%`)
          .orWhere('email', 'like', `%${search}%`)
          .orWhere('username', 'like', `%${search}%`);
      });
    }

    const result = await q.count<{ count: number | string }>('* as count').first();
    return Number(result?.count || 0);
  }

  async findOne(id: string | { id: string } | { email: string } | { username: string }) {
    const where = typeof id === 'string' ? { id } : id;
    const user = await this.query.where(where).first();

    if (!user) {
      return null;
    }

    return {
      ...user,
      isEmailVerified: Boolean(user.isEmailVerified),
      createdAt: new Date(user.createdAt),
      updatedAt: new Date(user.updatedAt),
    };
  }

  async create(user: User) {
    await this.query.insert(user);
    return user;
  }

  async update(id: string, data: Partial<User>) {
    const updateData = { ...data, updatedAt: new Date() } as any;

    if (updateData.isEmailVerified !== undefined) {
      updateData.isEmailVerified = updateData.isEmailVerified ? 1 : 0;
    }

    await this.query.where({ id }).update(updateData);
  }

  async delete(id: string | User) {
    const userId = typeof id === 'string' ? id : id.id;
    await this.query.where({ id: userId }).delete();
  }
}
