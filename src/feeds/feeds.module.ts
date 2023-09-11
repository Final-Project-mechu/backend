import { Module } from '@nestjs/common';
import { FeedsController } from './feeds.controller';
import { FeedsService } from './feeds.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Feed } from 'src/entity/feed.entity';
import { FeedLike } from 'src/entity/feed.like.entity';
import { Favorite } from 'src/entity/favorite.entity';
import { FeedFavorite } from 'src/entity/feed.favorite.entity';
import { User } from 'src/entity/user.entity';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { multerOptionsFactory } from 'src/multer/multer.options.factory';
import { S3Service } from 'src/aws/s3.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Feed, FeedLike, Favorite, FeedFavorite]),
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: multerOptionsFactory,
      inject: [ConfigService],
    }),
  ],
  controllers: [FeedsController],
  providers: [FeedsService, S3Service],
})
export class FeedsModule {}
