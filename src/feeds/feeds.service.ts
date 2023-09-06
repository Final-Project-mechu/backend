import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Feed } from 'src/entity/feed.entity';
import { FeedLike } from 'src/entity/feed.like.entity';
import { Favorite } from 'src/entity/favorite.entity';
import { DataSource, Repository } from 'typeorm';
import _ from 'lodash';

@Injectable()
export class FeedsService {
  constructor(
    @InjectRepository(Feed) private readonly feedRepository: Repository<Feed>,
    @InjectRepository(FeedLike)
    private readonly feedLikeRepository: Repository<FeedLike>,
    @InjectRepository(Favorite)
    private readonly favoriteRepository: Repository<Favorite>,
    private dataSource: DataSource,
  ) {}
  // 1번. 피드의 제목과 설명을 붙인 게시글을 작성한다.
  // 2번. 작성한 피드의 아이디를 가져온다.
  // 1번. (각각의)favorite id에 해당하는 row를 update 시켜준다
  //  : feed_id = null => feed_id = feed_id
  //  : deleted_at = 2023 ...
  // 2번. 업데이트 한 favorite의 정보를 가져온다.
  // 3번. 피드의 제목과 설명을 붙인 게시글을 작성완료한다.
  // 트랜잭션 적용해야 됨 자꾸 favorite id가 없는데 생성되니까
  async createFeed(
    user_id: number,
    favorite_ids: number[],
    title: string,
    description: string,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const user = { id: user_id };
      const createdFeed = await this.feedRepository.insert({
        users: user,
        title,
        description,
      });
      const createdFeedId = createdFeed.identifiers[0].id;
      for (const favorite_id of favorite_ids) {
        const favoriteConfirm = await this.favoriteRepository.findOne({
          where: { id: favorite_id, deletedAt: null },
        });
        if (!favoriteConfirm) {
          // await queryRunner.rollbackTransaction();
          throw new NotFoundException('이미 삭제된 favorite_id입니다.');
        }
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
      await queryRunner.commitTransaction();

      return {
        message: `${favorite_ids}로 피드번호 ${createdFeedId}번으로 피드가 생성되었습니다.`,
      };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async getFeeds() {
    const allFeeds = await this.feedLikeRepository
      .query(`select f.title, f.createdAt, count(fl.feed_id) as likecount 
      from feed f
      left join feed_like fl on f.id = fl.feed_id
      group by f.id
      order by likecount desc
      `);
    return allFeeds;
  }

  // 피드 상세조회
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
    const favoritesInFeed = await this.favoriteRepository.query(
      `SELECT * FROM favorite WHERE feed_id = ${id}`,
    );

    // 물어보기 왜 안되는지???
    // const favoritesInFeed = await this.favoriteRepository.find({
    //   where: {
    //     feeds: { id: id },
    //     deletedAt: Not(IsNull()),
    //   },
    //   relations: ['feeds'],
    // });
    console.log(`잘들어왔나 확인 ${id}`, favoritesInFeed);
    return [findFeed, favoritesInFeed];
  }

  // 피드 수정하기 (제목, 내용만 수정가능)
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

  // 피드 삭제하기
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

  // 피드의 좋아요 수 조회하기
  async getFeedLikes(feed_id: number) {
    const feedLikeCount = await this.feedLikeRepository
      .createQueryBuilder('feed_like')
      .select('COUNT(*)', 'count')
      .where('feed_like.feed_id = :feed_id', { feed_id })
      .getRawOne();
    return feedLikeCount;
  }

  // 피드 좋아요
  async feedLike(feed_id: number, user_id: number) {
    await this.feedLikeRepository.insert({ feed_id, user_id });
    return { message: '좋아요 추가' };
  }

  // 피드 좋아요 취소
  async feedLikeCancel(feed_id: number, user_id: number) {
    await this.feedLikeRepository.delete({ feed_id, user_id });
    return { message: '좋아요 취소' };
  }
}
