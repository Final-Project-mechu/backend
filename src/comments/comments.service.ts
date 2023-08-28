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
    // const feedId = await this.feedRepository.findOne({})
    // if (!feedId) {
    //   throw new NotFoundException(`게시글이 조회되지 않습니다.`);
    // }
  console.log('Service',feed_id);
const result = await this.commentRepository.query(`select * from comment where feed_id=${feed_id} and deletedAt is null`)
    // const result = await this.commentRepository.find({
    //   where: [{ deletedAt: null }, { id: feed_id}],
    //   select: ['contents', 'nick_name', 'createdAt', 'updatedAt'],
    // });
    // console.log(result);
    
    return result
    // if (!comment) {
    //   throw new NotFoundException(`댓글이 존재하지 않습니다.`);
    // }
    // return comment;
  }

  // 댓글 생성
  async createComment(
    user_id: number,
    feedId: number,
    createCommentDto: CreateCommentDto,
  ) 
  {
    const user = await this.userRepository.findOne({
      where: { id: user_id },
    });
    if (!user) {
      throw new UnauthorizedException(`로그인 후 댓글 작성이 가능합니다.`);
    }
    const nickname = user.nick_name

    const feed = await this.feedRepository.findOne({
      where: { id: feedId },
    });
    if (!feed) {
      throw new NotFoundException(`게시글이 조회되지 않습니다.`);
    }
    const { contents } = createCommentDto;
    if (!contents) {
      throw new BadRequestException(`댓글을 작성해주세요.`);
    }
    const feedComment = this.commentRepository.create({
      user_id,
      feedId,
      contents
    });
    return await this.commentRepository.save(feedComment);
  }

  //댓글 수정
  async updateComment(
    user_id: number,
    commentId: number,
    updateCommentDto: UpdateCommentDto,
  ) {

    const myComment = await this.commentRepository.findOne({
      where: {id: commentId}
    })

    if (!myComment) {
      throw new NotFoundException(`댓글이 조회되지 않습니다.}`);
    }

    const user = await this.userRepository.findOne({
      where: { id: user_id },
    });
    if (!user) {
      throw new UnauthorizedException(`본인이 작성한 댓글만 수정가능합니다.`);
    }

    // const feed = await this.feedRepository.findOne({
    //   where: { id: feedId },
    // });
    // if (!feed) {
    //   throw new NotFoundException(`게시글이 조회되지 않습니다.`);
    // }
 
    const { contents } = updateCommentDto;
    if (!updateCommentDto.contents) {
      throw new BadRequestException(`댓글을 입력해주세요`);
    }
    await this.commentRepository.update({ id: commentId }, { contents });
    return await this.commentRepository.findOne({
      where: { id: commentId },
    });
  }

  // // 댓글 삭제
  async deleteComment(
    user_id: number,
    id: number,
  ): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { id: user_id },
    });
    if (!user) {
      throw new UnauthorizedException(`본인이 작성한 댓글만 삭제가 가능합니다.`);
    }



    const myComment = await this.commentRepository.findOne({
      where: {id}
    })
    if (!myComment) {
      throw new NotFoundException(
        `댓글이 조회되지 않습니다.`,
      );
    }
    const remove = await this.commentRepository.softDelete(id);
    if (remove.affected === 0) {
      throw new NotFoundException(
        `해당 댓글이 조회되지 않습니다.`,
      );
    }
  }
}
