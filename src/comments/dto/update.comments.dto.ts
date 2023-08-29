import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateCommentDto {
  @IsString()
<<<<<<< HEAD
=======
  @IsNotEmpty()
>>>>>>> 4f63e9656fbd0269f1d24c4b36211bdacc127b8f
  readonly contents: string;
}
