import {
  Matches,
  IsString,
  IsEmail,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  readonly email: string;

  @IsString()
  @MinLength(4)
  @MaxLength(10)
  @Matches(/(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])/)
  readonly password: string;

  @IsString()
  @MinLength(4)
  @MaxLength(10)
  @Matches(/(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])/)
  readonly passwordConfirm: string;

  @IsString()
  readonly nick_name: string;

  @IsString()
  readonly refresh_token: string;

  @IsString()
<<<<<<< HEAD
  readonly is_admin: boolean;

  @IsString()
  readonly verificationCode: string;
=======
  readonly is_admin: number;
>>>>>>> 4f63e9656fbd0269f1d24c4b36211bdacc127b8f
}
