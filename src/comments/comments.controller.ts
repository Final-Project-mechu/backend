import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create.comments.dto';
import { UpdateCommentDto } from './dto/update.comments.dto';
import { request, Request } from 'express';
interface RequestWithLocals extends Request {
  locals: {
    user: {
      id: number;
      nick_name: string;
    };
  };
}

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentService: CommentsService) {}

  //댓글 조회
  @Get('/:feed_id')
  async getCommentsByFeedId(@Param('feed_id') feed_id: number) {
    return await this.commentService.getCommentsByFeedId(feed_id);
  }

  //댓글 쓰기
  @Post('/:feedId')
  @UsePipes(ValidationPipe)
  CreateComment(
    @Req() request: RequestWithLocals,
    @Param('feedId') feedId: number,
    @Body() data: CreateCommentDto,
  ) {
    const auth = request.locals.user;
    return this.commentService.createComment(auth.id, feedId, data.contents);
  }

  // 댓글 수정
  @Patch('/:commentId')
  updateComment(
    @Req() request: RequestWithLocals,
    @Param('commentId') commentId: number,
    @Body() data: UpdateCommentDto,
  ) {
    const auth = request.locals.user;
    return this.commentService.updateComment(auth.id, commentId, data.contents);
  }

  // 댓글 삭제
  @Delete('/:commentId')
  deleteComment(
    @Req() request: RequestWithLocals,
    @Param('commentId') commentId: number,
  ) {
    const auth = request.locals.user;
    return this.commentService.deleteComment(auth.id, commentId);
  }
}
