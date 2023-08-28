import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create.comments.dto';
import { UpdateCommentDto } from './dto/update.comments.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentService: CommentsService) {}

  //댓글 조회
  @Get('/:feedId')
  async getCommentsByFeedId(@Param('feedId') feedId: number) {
    return await this.commentService.getCommentsByFeedId(feedId);
  }

  //댓글 쓰기
  @Post('/:feedId')
  @UsePipes(ValidationPipe)
  CreateComment(
    // @Req() req:any,
    @Param('feedId') feedId: number,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.commentService.createComment(
      // req.user_id,
      feedId,
      createCommentDto,
    );
  }

  // 댓글 수정
  @Patch('/:feedId/:commentId')
  updateComment(
    // @Req() req,
    @Param('feedId') feedId: number,
    @Param('commentId') feed_comment_id: number,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.commentService.updateComment(
      //   req.userId,
      feed_comment_id,
      feedId,
      updateCommentDto,
    );
  }

  // 댓글 삭제
  @Delete(':feedId/:commentId')
  deleteComment(
    // @Req() req,
    @Param('feedId') feedId: number,
    @Param('commentId') feed_comment_id: number,
  ) {
    return this.commentService.deleteComment(
      //   req.userId,
      feed_comment_id,
      feedId

    );
  }
}
