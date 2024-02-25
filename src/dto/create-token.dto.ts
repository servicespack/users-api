import { IsString } from 'class-validator';

export class CreateTokenDto {
  @IsString() username!: string;

  @IsString() password!: string;
}
