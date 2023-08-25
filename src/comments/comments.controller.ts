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

  
  // @Put(':commentId')
  // async updateComment(
  //   @Param('commentId', ValidationPipe) commentId: number,
  //   @Body() updateCommentDto: UpdateCommentDto,
  // )  {
  //   const update = await this.commentsService.updateComment(commentId, updateCommentDto)
  // }if (update) {
  //   return { message: "댓글이 성공적으로 수정되었습니다.", comment: {update}}
  // }
  // async updateComment(
  //   @Param(':commentId') commentId: number,
  //   @Body() body: UpdateCommentDto,
  //   @Req() req: any,
  // ) {
  //   return await this.commentsService.updateComment(
  //     commentId,
  //     body,
  //     req.locals.user.id,
  //   );
  // }

  // 댓글 삭제 http://localhost:3000/comments/:commentId
//   @Delete(':commentId')
//   async deleteComment(@Param(':commentId') commentId: number, @Req() req: any) {
//     return await this.commentsService.deleteComment(
//       commentId,
//       req.locals.user.id,
//     );
//   }
// }

// @Delete('/:boardId/comments/:commentId')
// remove(
//   @CurrentUser() user: User,
//   @Param('boardId') boardId: number,
//   @Param('commentId') commentId: number,
// ) {
//   return this.commentsService.remove(user, boardId, commentId);
// }
// 
}
