import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from '../entity/user.entity';
import { Feed } from 'src/entity/feed.entity';
import { FeedLike } from 'src/entity/feed.like.entity';
import { Comment } from 'src/entity/comment.entity';
import { Favorate } from 'src/entity/favorate.entity';
import { Category } from 'src/entity/category.entity';
import { Food } from 'src/entity/food.entity';
import { FoodLike } from 'src/entity/food.like.entity';
import { Foodimg } from 'src/entity/food.img.entity';
import { Note } from 'src/entity/note.entity';
import { Friends } from 'src/entity/friend.entity';
import { Friendlist } from 'src/entity/friendlist.entity';

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
        Favorate,
        Foodimg,
        FeedLike,
        Comment,
        FoodLike,
        Friends,
        Friendlist,
      ],
      synchronize: this.configService.get<boolean>('DATABASE_SYNCHRONIZE'),
    };
  }
}
