import { Module } from '@nestjs/common';
import { LikesFoodsService } from './likes.foods.service';
import { LikesFoodsController } from './likes.foods.controller';

@Module({
  providers: [LikesFoodsService],
  controllers: [LikesFoodsController],
})
export class LikesFoodsModule {}
