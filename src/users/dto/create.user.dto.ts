import {
  Matches,
  IsString,
  IsEmail,
  MinLength,
  MaxLength,
  IsNumber,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  readonly email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(10)
  @Matches(/(?=.*[0-9])(?=.*[a-z])/)
  readonly password: string;

  @IsString()
  @MinLength(6)
  @MaxLength(10)
  @Matches(/(?=.*[0-9])(?=.*[a-z])/)
  readonly passwordConfirm: string;

  @IsString()
  readonly nick_name: string;

  @IsNumber()
  readonly is_admin: number;
}
