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
  UnauthorizedException,
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
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
  ) {}

  // 댓글 조회
  async getAllComments(feedId: number): Promise<Comment[]> {
    //feedService 에서 feedId있는지 조회해서 존재하는지 확인하는 로직 필요.
    const comments = await this.commentRepository.find({
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
    // const content = await this.commentRepository.create({id: feedId, comment: body.comment });
    return await this.commentRepository.save({
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
    const comment = await this.commentRepository.findOne({
  })
  if (!comment) {
    throw new NotFoundException('코맨트를 찾을 수 없습니다.')
  }

  await this.commentRepository
    .createQueryBuilder()
    .update(Comment)
    .set({
      contents: updateCommentDto.contents,
    })
    .where('id: commentId')
    .execute
  }

  //댓글 삭제

  async delete(userId: number, id: number) {
    const comment = await this.getCommentById(id);

    if (!comment) throw new HttpException('NOT_FOUND', HttpStatus.NOT_FOUND);

    if (userId !== comment.userId) {
      throw new UnauthorizedException();
    }

    return this.commentRepository.remove(comment);
  }

  async getCommentById(id: number) {
    return this.commentRepository.findOneBy({
      id,
    });
  }
}





  


