import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString() name!: string;

  @IsOptional()
  @IsString() username!: string;

  @IsOptional()
  @IsEmail() email!: string;

  @IsOptional()
  @IsString() password!: string;
}
