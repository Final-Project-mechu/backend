import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Feed } from 'src/entity/feed.entity';
import { FeedLike } from 'src/entity/feed.like.entity';
import { Favorite } from 'src/entity/favorite.entity';
import { Repository, Timestamp } from 'typeorm';
import _ from 'lodash';

@Injectable()
export class FeedsService {
  constructor(
    @InjectRepository(Feed) private readonly feedRepository: Repository<Feed>,
    @InjectRepository(FeedLike)
    private readonly feedLikeRepository: Repository<FeedLike>,
    @InjectRepository(Favorite)
    private readonly favoriteRepository: Repository<Favorite>,
  ) {}
  // 1번. 피드의 제목과 설명을 붙인 게시글을 작성한다.
  // 2번. 작성한 피드의 아이디를 가져온다.
  // 1번. (각각의)favorite id에 해당하는 row를 update 시켜준다
  //  : feed_id = null => feed_id = feed_id
  //  : deleted_at = 2023 ...
  // 2번. 업데이트 한 favorite의 정보를 가져온다.
  // 3번. 피드의 제목과 설명을 붙인 게시글을 작성완료한다.
  async createFeed(
    user_id: number,
    favorite_id: number,
    title: string,
    description: string,
  ) {
    const user = { id: user_id };
    const createdFeed = await this.feedRepository.insert({
      users: user,
      title,
      description,
    });
    const createdFeedId = createdFeed.identifiers[0].id;
    await this.favoriteRepository
      .createQueryBuilder()
      .update(Favorite)
      .set({
        feeds: createdFeedId,
        deletedAt: new Date(),
      })
      .where('id = :id', { id: favorite_id })
      .execute();
  }

  async getFeeds() {
    // 최신순, 좋아요순 생각해야됨(디폴트는 좋아요순)
    // 쿼리문으로 생각해보기 (order by, group by)
    const allFeeds = await this.feedRepository.find({
      where: { deletedAt: null },
      select: { title: true },
    });
    return allFeeds;
  }

  async getFeed(feedId: number) {
    // 근본적으로 문제가 있음.
    console.log('서비스에 id가 들어오는지 확인', feedId);
    const findFeed = await this.feedRepository.findOne({
      where: { id: feedId },
    });
    console.log('잘 찾아오는지 확인', findFeed);
    return findFeed;
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
