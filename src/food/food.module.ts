import { Module } from '@nestjs/common';
import { FoodService } from './food.service';
import { FoodController } from './food.controller';

@Module({
  providers: [FoodService],
  controllers: [FoodController]
})
export class FoodModule {}
