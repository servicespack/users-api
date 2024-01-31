/* eslint-disable max-classes-per-file */
import { Type } from 'class-transformer';
import {
  IsIn, IsNumber, IsPort, IsString, ValidateNested,
} from 'class-validator';

export class ConfigurationDatabaseDto {
  @IsIn(['mongo', 'sqlite'])
    driver!: 'mongo' | 'sqlite';

  @IsString()
    uri!: string;

  @IsString()
    name!: string;
}

export class ConfigurationServersHttpDto {
  @IsPort()
    port!: string;
}

export class ConfigurationServersDto {
  @Type(() => ConfigurationServersHttpDto)
  @ValidateNested() http!: ConfigurationServersHttpDto;
}

export class ConfigurationDto {
  @IsIn(['development', 'production'])
    environment!: 'development' | 'production';

  @Type(() => ConfigurationDatabaseDto)
  @ValidateNested() database!: ConfigurationDatabaseDto;

  @Type(() => ConfigurationServersDto)
  @ValidateNested() servers!: ConfigurationServersDto;
}
