import { IsIn, IsString, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer';

export class ConfigurationDatabaseDto {
  @IsIn(['mongo', 'sqlite'])
  driver!: 'mongo' | 'sqlite';

  @IsString()
  uri!: string

  @IsString()
  name!: string
}

export class ConfigurationDto {
  @IsIn(['development', 'production'])
  environment!: 'development' | 'production'

  @Type(() => ConfigurationDatabaseDto)
  @ValidateNested() database!: ConfigurationDatabaseDto
}
