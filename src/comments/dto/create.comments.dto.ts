 import { IsString, IsNotEmpty } from "class-validator";

export class CreateCommentDto {

    @IsNotEmpty({ message: '댓글을 입력해주세요.'})
    @IsString()
    comment: string;
} 