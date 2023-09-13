import { PickType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create.user.dto';
import { IsString, MinLength, MaxLength, Matches } from 'class-validator';
import { Column } from 'typeorm';

export class UpdateUserDto extends PickType(CreateUserDto, [
  'password',
] as const) {
  @IsString()
  @MinLength(4)
  @MaxLength(10)
  @Matches(/(?=.*[0-9])(?=.*[a-z])/)
  readonly newPassword: string;

  @IsString()
  readonly newNick_name: string;
}
