import { IsString, Length } from 'class-validator';

export class CreateFeedDto {
  @IsString()
  @Length(1, 20)
  readonly title: string;

  @IsString()
  @Length(5)
  readonly description: string;
}
