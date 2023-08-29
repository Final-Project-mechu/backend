import { IsEmpty, IsNotEmpty, IsString } from 'class-validator';

export class CreateCommentDto {
  
  @IsString()
  readonly contents: string;
}
