import {
  BadRequestException,
  Body,
  Get,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create.comments.dto';
import { User } from 'src/entity/user.entity';
import { Feed } from 'src/entity/feed.entity';
import { Comment } from 'src/entity/comment.entity';
import { UpdateCommentDto } from './dto/update.comments.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Comment)
    private commentRePository: Repository<Comment>,
  ) {}

  // 댓글 조회
  async getAllComments(feedId: number): Promise<Comment[]> {
    //feedService 에서 feedId있는지 조회해서 존재하는지 확인하는 로직 필요.
    const comments = await this.commentRePository.find({
      where: { id: feedId },
    });
    return comments;
  }

  // 댓글 생성
  async createComment(
    feedId: number,
    body: CreateCommentDto,
  ): Promise<Comment> {
    const { comment } = body;
    //feedService 에서 feedId있는지 조회해서 존재하는지 확인하는 로직 필요.
    if (comment) {
      throw new BadRequestException('댓글을 작성해주세요.');
    }
    // const content = await this.commentRePository.create({id: feedId, comment: body.comment });
    return await this.commentRePository.save({
      id: feedId,
      comment: body.comment,
    });
  }

  // 댓글 수정
async update(
  user: User,
  feedId: number,
  commentId: number,
  updateCommentDto: UpdateCommentDto,
  ): Promise<void> {
    const comment = await this.commentRePository.findOne({
  })
  if (!comment) {
    throw new NotFoundException('코맨트를 찾을 수 없습니다.')
  }

  await this.commentRePository
    .createQueryBuilder()
    .update(Comment)
    .set({
      contents: updateCommentDto.contents,
    })
    .where('id: commentId')
    .execute
  }
}




  // 댓글 삭제
  // async remove(user: Users, boardId: number, commentId: number): Promise<void> {
  //   const comment = await this.commentsRepository.findOne({
  //     where: { id: commentId, board: { id: boardId }, user: { id: user.id } },
  //   });

  //   if (!comment) {
  //     throw new NotFoundException();
  //   }

  //   await this.commentsRepository.remove(comment);
  // }


