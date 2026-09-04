import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator'

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name!: string

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  username!: string

  @IsOptional()
  @IsEmail()
  email!: string

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password!: string
}
