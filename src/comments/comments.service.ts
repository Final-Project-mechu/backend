import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from 'src/entity/comment.entity';
import { CreateCommentDto } from './dto/create.comments.dto';
import { UpdateCommentDto } from './dto/update.comments.dto';
import { Feed } from '../entity/feed.entity';
import { User } from 'src/entity/user.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(Feed)
    private readonly feedRepository: Repository<Feed>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // 게시글 ID로 댓글 전체 조회
  async getCommentsByFeedId(feed_id: number) {
    const result = await this.commentRepository.find({
      where: { feedId: feed_id, deletedAt: null },
    });
    return result;
  }

  // 댓글 생성
  async createComment(user_id: number, feedId: number, contents: string) {
    const user = await this.userRepository.findOne({
      where: { id: user_id },
      select: ['id', 'nick_name'],
    });
    if (!user) {
      throw new UnauthorizedException(`로그인 후 댓글 작성이 가능합니다.`);
    }
    const feed = await this.feedRepository.findOne({
      where: { id: feedId },
    });
    if (!feed) {
      throw new NotFoundException(`게시글이 조회되지 않습니다.`);
    }
    this.commentRepository.insert({
      user_id: user.id,
      nick_name: user.nick_name,
      feedId,
      contents,
    });
    return { Message: '댓글이 생성되었습니다!' };
  }

  //댓글 수정
  async updateComment(user_id: number, commentId: number, contents: string) {
    const myComment = await this.commentRepository.query(`
      SELECT * FROM comment WHERE id = ${commentId}
    `);
    if (!myComment) {
      throw new NotFoundException('존재하지 않는 댓글입니다.');
    }
    if (myComment[0].user_id !== user_id) {
      throw new UnauthorizedException('작성한 사람만 수정할 수 있습니다.');
    }
    await this.commentRepository.update({ id: commentId }, { contents });
    return { Message: '댓글이 수정되었습니다.' };
  }

  // 댓글 삭제
  async deleteComment(user_id: number, id: number): Promise<any> {
    const myComment = await this.commentRepository.findOne({
      where: { id: id },
    });
    if (myComment.user_id !== user_id) {
      throw new UnauthorizedException(
        '본인이 작성한 댓글만 삭제가 가능합니다.',
      );
    }
    if (!myComment) {
      throw new NotFoundException(`댓글이 조회되지 않습니다.`);
    }
    await this.commentRepository.softDelete(id);
    return { Message: '댓글이 삭제되었습니다.' };
  }
}
