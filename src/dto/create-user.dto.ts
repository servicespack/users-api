import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
    name!: string;

  @IsString()
    username!: string;

  @IsEmail()
    email!: string;

  @IsString()
  @MinLength(8)
    password!: string;
}
