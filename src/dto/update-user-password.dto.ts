import { IsString, MinLength } from 'class-validator';

export class UpdateUserPasswordDto {
  @IsString()
    currentPassword!: string;

  @IsString()
  @MinLength(8)
    newPassword!: string;
}
