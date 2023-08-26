import { Module } from '@nestjs/common';
import { LikesFoodsService } from './likes.foods.service';
import { LikesFoodsController } from './likes.foods.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
//import { FoodSurvey } from 'src/entity/food.survey.entity';
import { User } from 'src/entity/user.entity';
import { Food } from 'src/entity/food.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ Food, User])],
  providers: [LikesFoodsService],
  controllers: [LikesFoodsController],
})
export class LikesFoodsModule {}
