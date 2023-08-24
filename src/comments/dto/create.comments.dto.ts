 import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, MinLength, MaxLength, IsNumber } from "class-validator";

export class CreateCommentDto {
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({
        description: '작성자 아이디',
        required: true,
        example: '1',
    })
    user_id: number

    @IsNotEmpty()
    @ApiProperty({
            description: '내용',
            required: true,
            example: '햄버거가 맛있어요'
        })
        contents: string
    }
