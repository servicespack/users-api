import { Entity, Property } from '@mikro-orm/core'
import { SoftDeletable } from 'mikro-orm-soft-delete'

import { InitialEntity } from './initial.entity'

@SoftDeletable(() => User, 'deletedAt', () => new Date())
@Entity()
export class User extends InitialEntity {
  @Property()
    name!: string

  @Property()
    email!: string

  @Property({ hidden: true })
    emailVerificationKey: string = ''

  @Property()
    isEmailVerified: boolean = false

  @Property()
    username!: string

  @Property({ hidden: true })
    password!: string

  @Property({ hidden: true })
    createdAt: Date = new Date()

  @Property({ hidden: true, onUpdate: () => new Date() })
    updatedAt: Date = new Date()

  @Property({ hidden: true, nullable: true })
    deletedAt: Date | null = null
}
