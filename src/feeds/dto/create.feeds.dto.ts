import { IsString, Length } from 'class-validator';

export class CreateFeedDto {
  @IsString()
  @Length(5, 20)
  readonly title: string;

  @IsString()
  @Length(20)
  readonly description: string;
}
