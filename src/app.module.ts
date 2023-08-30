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
import { CommentsModule } from './comments/comments.module';
import { AdvertisementsModule } from './advertisements/advertisements.module';
import { FoodModule } from './food/food.module';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmConfigService } from './config/typeorm.config.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Favorite } from './entity/favorite.entity';
import { JwtConfigService } from './config/jwt.config.service';
import { AuthMiddleware } from './auth/auth.middleware';
import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { MailModule } from './mail/mail.module';
import { FoodUserWeight } from './entity/food.user.weight.entity';
import { UserAction } from './entity/user.action';
import { FoodIngredient } from './entity/food.ingredient.entity';
import { Ingredient } from './entity/ingredient.entity';
//import { AuthModule } from './auth/auth.module';
import { PassportModule } from '@nestjs/passport';
//import { FriendModule } from './friend/friend.module';
import { IngredientModule } from './ingredient/ingredient.module';

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
    FoodUserWeight,
    UserAction,
    FoodIngredient,
    Ingredient,
    FeedModule,
    Favorite,
    CommentsModule,
    AdvertisementsModule,
    MailModule,
    IngredientModule,
    // FriendModule,
    // AuthModule,
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
        { path: 'friends/send-request', method: RequestMethod.POST },
        { path: 'friends/accept-friend', method: RequestMethod.POST },
        { path: 'category', method: RequestMethod.POST },
        { path: 'category/:category_id', method: RequestMethod.PATCH },
        { path: 'ingredient', method: RequestMethod.POST },
        { path: 'ingredient/:ingredient_id', method: RequestMethod.PATCH },
      );
  }
}