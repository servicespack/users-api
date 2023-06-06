import { IsIn, IsObject, IsString } from 'class-validator'

export class ConfigurationDatabaseDto {
  @IsIn(['mongo', 'sqlite'])
  driver!: 'sqlite' | 'mongo';

  @IsString()
  uri!: string

  @IsString()
  name!: string
}

export class ConfigurationDto {
  @IsObject() database!: ConfigurationDatabaseDto
}
