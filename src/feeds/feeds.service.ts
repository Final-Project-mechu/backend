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
    const favoriteConfirm = await this.favoriteRepository.findOne({
      where: { id: favorite_id, deletedAt: null },
    });
    if (!favoriteConfirm) {
      return { errorMessage: '이미 삭제된 favorite_id입니다.' };
    }
    const deleteFavoriteCart = await this.favoriteRepository
      .createQueryBuilder()
      .update(Favorite)
      .set({
        feeds: createdFeedId,
        deletedAt: new Date(),
      })
      .where('id = :id', { id: favorite_id })
      .execute();
    return deleteFavoriteCart;
  }

  async getFeeds() {
    // const allFeeds = await this.feedLikeRepository
    //   .createQueryBuilder('fl')
    //   .select('f.id', 'id')
    //   .addSelect('f.title', 'title')
    //   .addSelect('COUNT(*)', '피드 좋아요수')
    //   .innerJoin('fl.feed', 'f')
    //   .groupBy('fl.feed_id')
    //   .orderBy('피드 좋아요수', 'DESC')
    //   .getRawMany();
    const allFeeds = await this.feedLikeRepository
      .query(`SELECT f.id, f.title, COUNT(*) as '피드좋아요'
      FROM feed_like fl INNER JOIN feed f ON f.id = fl.feed_id
      GROUP BY fl.feed_id ORDER BY '피드좋아요' DESC
      `);
    return allFeeds;
  }

  async getFeed(id: number) {
    const findFeed = await this.feedRepository.findOne({
      where: { id },
      relations: ['users'],
      select: [
        'id',
        'user_id',
        'title',
        'description',
        'createdAt',
        'updatedAt',
      ],
    });
    if (!findFeed) {
      return { errorMessage: '잘못된 id입니다.' };
    }
    return findFeed;
  }

  async updateFeed(
    id: number,
    user_id: number,
    title: string,
    description: string,
  ) {
    const findFeed = await this.getFeed(id);
    if (_.isNil(findFeed)) {
      throw new NotFoundException(
        `피드번호 ${id}번의 피드를 찾을 수 없습니다.`,
      );
    }
    if (findFeed['user_id'] !== user_id) {
      throw new UnauthorizedException('작성자만 수정 가능합니다.');
    }
    await this.feedRepository.update(id, { title, description });
  }
  async deleteFeed(id: number, user_id: number) {
    const findFeed = await this.getFeed(id);
    if (_.isNil(findFeed)) {
      throw new NotFoundException(
        `피드번호 ${id}번의 피드를 찾을 수 없습니다.`,
      );
    }
    if (findFeed['user_id'] !== user_id) {
      throw new UnauthorizedException('작성자만 삭제 가능합니다.');
    }
    await this.feedRepository.softDelete(id);
    return { message: `피드번호 ${id}번의 피드가 삭제되었습니다.` };
  }
  async getFeedLikes(feed_id: number) {
    const feedLikeCount = await this.feedLikeRepository
      .createQueryBuilder('feed_like')
      .select('COUNT(*)', 'count')
      .where('feed_like.feed_id = :feed_id', { feed_id })
      .getRawOne();
    return feedLikeCount;
  }
  async feedLike(feed_id: number, user_id: number) {
    await this.feedLikeRepository.insert({ feed_id, user_id });
    return { message: '좋아요 추가' };
  }
  async feedLikeCancel(feed_id: number, user_id: number) {
    await this.feedLikeRepository.delete({ feed_id, user_id });
    return { message: '좋아요 취소' };
  }
}
