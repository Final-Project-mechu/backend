import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  ValidationPipe,
  UseFilters,
  HttpException,
  Delete,
  Req,
  Patch,
  BadRequestException,
} from '@nestjs/common';
import { CurrentUser } from 'common/user.decorator';
import { User } from 'src/entity/user.entity';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create.comments.dto';
import { UpdateCommentDto } from './dto/update.comments.dto';
import { Comment } from 'src/entity/comment.entity';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  // 댓글 조회 http://localhost:3000/comments/:feedId
  @Get(':feedId')
  async getAllComments(@Param('feedId') feedId: number) {
    return await this.commentsService.getAllComments(feedId);
  }

  // 댓글 생성 http://localhost:3000/comments/:feedId

  @Post(':feedId')
  async createComment(
    @Param('feedId') feedId: number,
    @Body() body: CreateCommentDto,
  ) {
    return await this.commentsService.createComment(feedId, body);
  }

  // 댓글 수정 http://localhost:3000 /comments/:commentId

  @Patch()
  update(
    @CurrentUser() user: User,
    @Param('feedId') feedId: number,
    @Param('commentId') commentId: number,
    @Body(ValidationPipe) updateCommentDto: UpdateCommentDto,
  ) {
    if (!updateCommentDto.contents) {
      throw new BadRequestException();
    }
  
    return this.commentsService.update(
      user, // 변수를 전달해야 합니다.
      feedId,
      commentId,
      updateCommentDto, // 변수를 전달해야 합니다.
    );
  }

  


  @Delete(':id')
  remove(@CurrentUser() userInfo, @Param('id', ParseIntPipe) id: number) {
    return this.commentsService.delete(userInfo.id, id);
  }
}
