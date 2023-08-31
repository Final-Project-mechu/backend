import { Module } from '@nestjs/common';
import { FeedsController } from './feeds.controller';
import { FeedsService } from './feeds.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Feed } from 'src/entity/feed.entity';
import { FeedLike } from 'src/entity/feed.like.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Feed, FeedLike])],
  controllers: [FeedsController],
  providers: [FeedsService],
})
export class FeedsModule {}
