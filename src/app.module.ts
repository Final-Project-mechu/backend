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
import { FeedModule } from './feed/feed.module';
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
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { MailModule } from './mail/mail.module';
import { AuthModule } from './auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { FriendModule } from './friend/friend.module';
import { FriendlistModule } from './friendlist/friendlist.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
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
    MailerModule.forRoot({
      transport: 'smtps://user@domain.com:pass@smtp.domain.com',
      defaults: {
        from: '"nest-modules" <modules@nestjs.com>',
      },
      template: {
        dir: __dirname + '/templates',
        adapter: new PugAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    PassportModule.register({ session: false }),
    UsersModule,
    FoodModule,
    CategoryModule,
    FeedModule,
    LikesFoodsModule,
    DislikesFoodsModule,
    DislikesIngredientsModule,
    CommentsModule,
    AdvertisementsModule,
    JwtModule,
    MailModule,
    FriendModule,
    AuthModule,
    FriendlistModule,
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
        { path: 'users/update', method: RequestMethod.PATCH },
        { path: 'users/quit', method: RequestMethod.DELETE },
        { path: 'comments/:feedId', method: RequestMethod.POST },
        { path: 'comments/:commentId', method: RequestMethod.PATCH },
        { path: 'comments/:commentId', method: RequestMethod.DELETE }
        );
    consumer.apply(AuthMiddleware).forRoutes(
      { path: 'users/update', method: RequestMethod.PATCH },
      { path: 'users/quit', method: RequestMethod.DELETE },
      { path: 'friends/send-request', method: RequestMethod.POST },
      // { path: 'categoty', method: RequestMethod.POST },
      { path: 'friends/accept-friend', method: RequestMethod.POST },
    );
  }
}
