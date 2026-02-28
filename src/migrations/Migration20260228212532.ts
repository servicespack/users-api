import { Migration } from '@mikro-orm/migrations';

export class Migration20260228212532 extends Migration {
  async up(): Promise<void> {
    this.addSql('create table "user" ("id" varchar(255) not null, "name" varchar(255) not null, "email" varchar(255) not null, "email_verification_key" varchar(255) not null default \'\', "is_email_verified" boolean not null default false, "username" varchar(255) not null, "password" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "user_pkey" primary key ("id"));');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "user";');
  }
}
