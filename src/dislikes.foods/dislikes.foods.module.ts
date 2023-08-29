import { Module } from '@nestjs/common';
import { DislikesFoodsService } from './dislikes.foods.service';
import { DislikesFoodsController } from './dislikes.foods.controller';

@Module({
  providers: [DislikesFoodsService],
  controllers: [DislikesFoodsController]
})
export class DislikesFoodsModule {}
