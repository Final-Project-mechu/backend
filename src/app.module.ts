import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { CategoryModule } from './category/category.module';
import { LikesFoodsModule } from './likes.foods/likes.foods.module';
import { DislikesFoodsModule } from './dislikes.foods/dislikes.foods.module';
import { DislikesIngredientsModule } from './dislikes.ingredients/dislikes.ingredients.module';
import { CommentsModule } from './comments/comments.module';
import { AdvertisementsModule } from './advertisements/advertisements.module';
import { FoodModule } from './food/food.module';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmConfigService } from './config/typeorm.config.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtConfigService } from './config/jwt.config.service';
import { AuthMiddleware } from './auth/auth.middleware';
import { FeedsModule } from './feeds/feeds.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: TypeOrmConfigService,
      inject: [ConfigService],
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useClass: JwtConfigService,
      inject: [ConfigService],
    }),
    UsersModule,
    FoodModule,
    CategoryModule,
    LikesFoodsModule,
    DislikesFoodsModule,
    DislikesIngredientsModule,
    CommentsModule,
    AdvertisementsModule,
    JwtModule,
    FeedsModule,
  ],
  controllers: [AppController],
  providers: [AppService, AuthMiddleware],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: 'users/update', method: RequestMethod.PUT },
        { path: 'users/update', method: RequestMethod.PATCH },
      );
  }
}
