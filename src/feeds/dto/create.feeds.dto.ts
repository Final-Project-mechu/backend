import { IsNumber, IsString } from 'class-validator';

export class CreateFeedDto {
  @IsString()
  readonly title: string;

  @IsString()
  readonly description: string;
}
