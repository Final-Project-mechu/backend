import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Feed } from 'src/entity/feed.entity';
import { FeedLike } from 'src/entity/feed.like.entity';
import { Favorite } from 'src/entity/favorite.entity';
import { FeedFavorite } from 'src/entity/feed.favorite.entity';
import { User } from 'src/entity/user.entity';
import { DataSource, Repository } from 'typeorm';
import _ from 'lodash';
import { S3Service } from 'src/aws/s3.service';

@Injectable()
export class FeedsService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Feed) private readonly feedRepository: Repository<Feed>,
    @InjectRepository(FeedLike)
    private readonly feedLikeRepository: Repository<FeedLike>,
    @InjectRepository(Favorite)
    private readonly favoriteRepository: Repository<Favorite>,
    @InjectRepository(FeedFavorite)
    private readonly feedFavoriteRepository: Repository<FeedFavorite>,
    private dataSource: DataSource,
    private readonly s3Service: S3Service,
  ) {}
  async createFavoriteFeed(
    user_id: number,
    favorite_ids: number | string,
    title: string,
    description: string,
    file: Express.Multer.File,
  ) {
    let favoriteIdsArry: number[];
    const image = await this.s3Service.putObject(file);
    console.log('서비스 확인', favorite_ids);
    if (typeof favorite_ids === 'string') {
      favoriteIdsArry = favorite_ids.split(',').map(id => parseInt(id));
    } else {
      favoriteIdsArry = [favorite_ids];
    }
    const user = { id: user_id };
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const createdFeed = await this.feedRepository.insert({
        users: user,
        title,
        description,
        image: image,
      });
      const createdFeedId = createdFeed.identifiers[0].id;
      for (const favorite_id of favoriteIdsArry) {
        await this.feedFavoriteRepository.insert({
          feed_id: createdFeedId,
          favorite_id: favorite_id,
        });
      }
      await queryRunner.commitTransaction();
      return {
        Message: `favorite id: ${favorite_ids}로 피드번호 ${createdFeedId}번으로 피드가 생성되었습니다.`,
      };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async createFeed(
    user_id: number,
    title: string,
    description: string,
    file: Express.Multer.File,
  ) {
    const user = { id: user_id };
    const image = await this.s3Service.putObject(file);
    const createdFeed = await this.feedRepository.insert({
      users: user,
      title,
      description,
      image,
    });
    return {
      Message: `피드번호 : ${createdFeed.identifiers[0].id}로 생성되었습니다.`,
    };
  }

  async getFeeds() {
    const allFeeds = await this.feedLikeRepository
      .query(`select f.id, f.title, f.createdAt, f.deletedAt, f.image, count(fl.feed_id) as likecount 
  from feed f
  left join feed_like fl on f.id = fl.feed_id
  where f.deletedAt is null
  group by f.id
  order by likecount desc
  `);
    return allFeeds;
  }

  // 피드 상세조회
  async getFeed(id: number) {
    const feedInfo = await this.feedRepository.findOne({
      where: { id },
      select: [
        'id',
        'user_id',
        'title',
        'image',
        'description',
        'createdAt',
        'updatedAt',
      ],
    });
    const feedOwner = feedInfo.user_id;
    const feedNickname = await this.userRepository.findOne({
      where: { id: feedOwner },
      select: ['nick_name'],
    });
    const findFeedinFavorites = await this.feedFavoriteRepository.find({
      where: { feed_id: id },
      select: ['favorite_id'],
    });
    const favoriteIds = findFeedinFavorites.map(
      feedFavorite => feedFavorite.favorite_id,
    );

    if (favoriteIds.length > 0) {
      const favoriteInfos = [];
      for (const favoriteId of favoriteIds) {
        const favoriteInfo = await this.favoriteRepository.findOne({
          where: { id: favoriteId },
        });
        favoriteInfos.push(favoriteInfo);
      }
      return [feedInfo, feedNickname, favoriteInfos];
    } else {
      return [feedInfo, feedNickname];
    }
  }

  // 피드 수정하기 (제목, 내용만 수정가능)
  async updateFeed(
    id: number,
    user_id: number,
    title: string,
    description: string,
    file: Express.Multer.File,
  ) {
    const findFeed = await this.feedRepository.findOne({
      where: { id: id },
    });
    if (!title && !description && !file) {
      throw new BadRequestException(
        '제목, 내용, 이미지 파일을 모두 입력해주세요!',
      );
    }
    if (_.isNil(findFeed)) {
      throw new NotFoundException(
        `피드번호 ${id}번의 피드를 찾을 수 없습니다.`,
      );
    }
    if (findFeed['user_id'] !== user_id) {
      throw new UnauthorizedException('작성자만 수정 가능합니다.');
    }
    const image = await this.s3Service.putObject(file);
    await this.feedRepository.update(id, { title, description, image });
    return { Message: `피드번호 ${id}번의 피드가 수정되었습니다.` };
  }

  // 피드 삭제하기
  async deleteFeed(id: number, user_id: number) {
    const findFeed = await this.feedRepository.findOne({
      where: { id: id },
    });
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

  // 유저가 특정 피드를 좋아요 했는지 조회
  async getUserFeedLike(id: number, user_id: number) {
    const findFeedLike = await this.feedLikeRepository.exist({
      where: { feed_id: id, user_id },
    });
    if (findFeedLike) {
      return true;
    } else {
      return false;
    }
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
