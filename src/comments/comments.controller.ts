import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create.comments.dto';

@Controller('comments')
export class CommentsController {
    constructor(private readonly commentsService: CommentsService) {}


    @Get()
    async getAllComments() {
        return this.commentsService.getAllComments()
    }

    @Post(":id")
    async createComment(
        @Param('id') id: string,
        @Body() body: CreateCommentDto,
    ) {
        return this.commentsService.createComment(id, body)
    }
}
