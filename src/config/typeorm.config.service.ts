import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from '../entity/user.entity';
import { Feed } from 'src/entity/feed.entity';
import { FeedLike } from 'src/entity/feed.like.entity';
import { Comment } from 'src/entity/comment.entity';
import { Favorite } from 'src/entity/favorite.entity';
import { Category } from 'src/entity/category.entity';
import { Food } from 'src/entity/food.entity';
import { FoodImg } from 'src/entity/food.img.entity';
import { FoodIngredient } from 'src/entity/food.ingredient.entity';
import { Ingredient } from 'src/entity/ingredient.entity';
import { FoodUserWeight } from 'src/entity/food.user.weight.entity';
import { UserAction } from 'src/entity/user.action';
import { Note } from 'src/entity/note.entity';


@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'mysql',
      host: this.configService.get<string>('DATABASE_HOST'),
      port: this.configService.get<number>('DATABASE_PORT'),
      username: this.configService.get<string>('DATABASE_USERNAME'),
      password: this.configService.get<string>('DATABASE_PASSWORD'),
      database: this.configService.get<string>('DATABASE_NAME'),
      entities: [
        User,
        Food,
        Feed,
        Note,
        Category,
        Favorite,
        FoodImg,
        FeedLike,
        Comment,
        FoodIngredient,
        Ingredient,
        FoodUserWeight,
        UserAction,
      ],
      synchronize: this.configService.get<string>('DATABASE_SYNCHRONIZE') === 'true',
    };
  }
}
