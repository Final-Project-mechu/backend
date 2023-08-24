import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Feed } from 'src/entity/feed.entity';
import { FeedLike } from 'src/entity/feed.like.entity';
import { Repository } from 'typeorm';
import _ from 'lodash';

@Injectable()
export class FeedsService {
  constructor(
    @InjectRepository(Feed) private readonly feedRepository: Repository<Feed>,
    @InjectRepository(FeedLike)
    private readonly feedLikeRepository: Repository<FeedLike>,
  ) {}
  createFeed(title: string, description: string) {
    return this.feedRepository.insert({ title, description });
  }
  async getFeeds() {
    // 최신순, 좋아요순 생각해야됨(디폴트는 좋아요순)
    // 쿼리문으로 생각해보기 (order by, group by)
    await this.feedRepository.find({
      where: {deletedAt: null},
      select: { title: true },
    });
  }
  async getFeed(id: number) {
    await this.feedRepository.findOne({
      where: { deletedAt: null, id }, // 삭제되지 않은 것
      select: ['title', 'description', 'createdAt', 'updatedAt'],
    });
  }
  async updateFeed(id: number, title: string, description: string) {
    await this.feedRepository.update(id, { title, description });
  }
  async deleteFeed(id: number) {
    const findFeed = await this.getFeed(id);
    if (_.isNil(findFeed)) {
      throw new NotFoundException(
        `피드번호 ${id}번의 피드를 찾을 수 없습니다.`,
      );
    }
    // if(findFeed.user_id !== user_id) {
    //   throw new UnauthorizedException('작성자만 삭제 가능합니다.')
    // }
    await this.feedRepository.softDelete(id);
    return { message: `피드번호 ${id}번의 피드가 삭제되었습니다.` };
  }
  async getFeedLikes(id: number) {
    // 피드 좋아요 개수
    await this.feedLikeRepository.query(`
    SELECT COUNT(*) FROM feedlike WHERE feed_id = ${id}
    `);
  }
  async feedLike(feed_id: number) {
    // user_id 넣어야됨
    await this.feedLikeRepository.insert({ feed_id });
  }
  async feedLikeCancel(feed_id: number) {
    // user_id 넣어야됨
    await this.feedLikeRepository.delete({ feed_id });
  }
}
