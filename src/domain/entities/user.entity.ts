import {
  EmailAlreadyVerifiedError,
  WrongVerificationKeyError,
} from '../errors'

export interface UserProps {
  id?: string
  name: string
  email: string
  username: string
  password: string
  isEmailVerified?: boolean
  emailVerificationKey?: string
  createdAt?: Date
  updatedAt?: Date
}

export class User {
  private readonly _id?: string
  private _name: string
  private _email: string
  private _username: string
  private _password: string
  private _isEmailVerified: boolean
  private _emailVerificationKey: string
  private readonly _createdAt?: Date
  private readonly _updatedAt?: Date

  constructor(props: UserProps) {
    this._id = props.id
    this._name = props.name
    this._email = props.email
    this._username = props.username
    this._password = props.password
    this._isEmailVerified = props.isEmailVerified ?? false
    this._emailVerificationKey = props.emailVerificationKey ?? ''
    this._createdAt = props.createdAt
    this._updatedAt = props.updatedAt
  }

  get id(): string | undefined {
    return this._id
  }

  get name(): string {
    return this._name
  }

  get email(): string {
    return this._email
  }

  get username(): string {
    return this._username
  }

  get password(): string {
    return this._password
  }

  get isEmailVerified(): boolean {
    return this._isEmailVerified
  }

  get emailVerificationKey(): string {
    return this._emailVerificationKey
  }

  get createdAt(): Date | undefined {
    return this._createdAt
  }

  get updatedAt(): Date | undefined {
    return this._updatedAt
  }

  updateProfile(props: { name?: string, email?: string, username?: string }): void {
    if (props.name !== undefined) {
      this._name = props.name
    }
    if (props.email !== undefined) {
      this._email = props.email
    }
    if (props.username !== undefined) {
      this._username = props.username
    }
  }

  changePassword(hashedPassword: string): void {
    this._password = hashedPassword
  }

  verifyEmail(key: string): void {
    if (this._isEmailVerified) {
      throw new EmailAlreadyVerifiedError()
    }
    if (key !== this._emailVerificationKey) {
      throw new WrongVerificationKeyError()
    }
    this._isEmailVerified = true
    this._emailVerificationKey = ''
  }

  toJSON() {
    return {
      id: this._id,
      name: this._name,
      email: this._email,
      username: this._username,
      isEmailVerified: this._isEmailVerified,
    }
  }
}
