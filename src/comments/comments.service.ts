import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from 'src/entity/comment.entity';
import { CreateCommentDto } from './dto/create.comments.dto';
import { UpdateCommentDto } from './dto/update.comments.dto';
// import {  Feed } from '../'

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    // private readonly feedRepository: Repository<Feed>,
  ) {}

  // 게시글 ID로 댓글 전체 조회
  async getCommentsByFeedId(feedId: number) {
    // const feedId = await this.feedRepository.findOne
    if (!feedId) {
      throw new NotFoundException(`게시글이 조회되지 않습니다.`);
    }
    const comment = await this.commentRepository.find({
      where: [{ deletedAt: null }, { id: feedId }],
      select: ['contents', 'nick_name', 'createdAt', 'updatedAt'],
    });
    if (!comment) {
      throw new NotFoundException(`댓글이 존재하지 않습니다.`);
    }
    return comment;
  }

  // 댓글 생성
  async createComment(feedId: number, createCommentDto: CreateCommentDto) {
    if (!feedId) {
      throw new NotFoundException(`게시글이 조회되지 않습니다.`);
    }
    const { contents } = createCommentDto;
    if (!contents) {
      throw new BadRequestException(`댓글을 작성해주세요.`);
    }
    const feedComment = this.commentRepository.create({
      // user_id,
      feedId,
      contents,
    });
    return await this.commentRepository.save(feedComment);
  }

  //댓글 수정
  async updateComment(
    // userId: number,
    feedId: number,
    feed_comment_id: number,
    updateCommentDto: UpdateCommentDto,
  ) {
    if (!feedId) {
      throw new NotFoundException(
        `게시글이 조회되지 않습니다.`,
      );
    }
    if (!feed_comment_id) {
      throw new NotFoundException(
        `댓글이 조회되지 않습니다.}`,
      );
    }
    const { contents } = updateCommentDto;
    if (!updateCommentDto.contents) {
      throw new BadRequestException(`댓글을 입력해주세요`);
    }
    await this.commentRepository.update({ id: feed_comment_id }, { contents });
    return await this.commentRepository.findOne({
      where: { id: feed_comment_id },
    });
  }

  // // 댓글 삭제
  async deleteComment(
    // userId: number,
    feedId: number,
    feed_comment_id: number,
  ): Promise<any> {
    if (!feedId) {
      throw new NotFoundException(
        `게시글이 조회되지 않습니다.`,
      );
    }
    if (!feed_comment_id) {
      throw new NotFoundException(
        `댓글이 조회되지 않습니다.: ${feed_comment_id}`,
      );
    }
    const remove = await this.commentRepository.delete({ id: feed_comment_id });
    if (remove.affected === 0) {
      throw new NotFoundException(
        `해당 댓글이 조회되지 않습니다. comentId: ${feed_comment_id}`,
      );
    }
  }
}
