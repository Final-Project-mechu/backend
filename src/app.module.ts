import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { CategoryModule } from './category/category.module';
import { CommentsModule } from './comments/comments.module';
import { FoodModule } from './food/food.module';
import { FavoritesModule } from './favorites/favorites.module';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmConfigService } from './config/typeorm.config.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Favorite } from './entity/favorite.entity';
import { JwtConfigService } from './config/jwt.config.service';
import { AuthMiddleware } from './auth/auth.middleware';
import { MailerModule } from '@nestjs-modules/mailer';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { MailModule } from './mail/mail.module';
import { FoodUserWeight } from './entity/food.user.weight.entity';
import { UserAction } from './entity/user.action.entity';
import { FoodIngredient } from './entity/food.ingredient.entity';
import { Ingredient } from './entity/ingredient.entity';
import { IngredientModule } from './ingredient/ingredient.module';
import { UsersActionsModule } from './users.actions/users.actions.module';
import { FoodsUsersWeightsModule } from './foods.users.weights/foods.users.weights.module';
import { AuthModule } from './auth/auth.module';
import { FeedsModule } from './feeds/feeds.module';

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
    UsersModule,
    FoodModule,
    CategoryModule,
    FoodUserWeight,
    UserAction,
    FoodIngredient,
    Ingredient,
    Favorite,
    CommentsModule,
    JwtModule,
    FavoritesModule,
    JwtModule,
    MailModule,
    IngredientModule,
    UsersActionsModule,
    FoodsUsersWeightsModule,
    AuthModule,
    FeedsModule,
  ],
  controllers: [AppController],
  providers: [AppService, AuthMiddleware],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(
      { path: 'users/find', method: RequestMethod.GET },
      { path: 'users/update', method: RequestMethod.PATCH },
      { path: 'users/quit', method: RequestMethod.POST },
      { path: 'users/logout', method: RequestMethod.POST },
      { path: 'friends/send', method: RequestMethod.POST },
      { path: 'friends/accept-friend', method: RequestMethod.POST },
      { path: 'category', method: RequestMethod.POST },
      { path: 'category/:category_id', method: RequestMethod.PATCH },
      { path: 'ingredient', method: RequestMethod.POST },
      { path: 'ingredient/:ingredient_id', method: RequestMethod.PATCH },
      { path: 'favorites', method: RequestMethod.POST },
      { path: 'favorites', method: RequestMethod.GET },
      { path: 'favorites/:id', method: RequestMethod.DELETE },
      { path: 'comments/:feedId', method: RequestMethod.POST },
      { path: 'comments/:commentId', method: RequestMethod.PATCH },
      { path: 'comments/:commentId', method: RequestMethod.DELETE },
      { path: 'friends/send-request', method: RequestMethod.POST },
      { path: 'friends/accept-friend', method: RequestMethod.POST },
      { path: 'food', method: RequestMethod.POST },
      { path: 'food/:food_id', method: RequestMethod.PATCH },
      { path: 'foods-ingredients', method: RequestMethod.POST },
      { path: 'foodimage', method: RequestMethod.POST },
      { path: 'food/foodimg', method: RequestMethod.POST },
      { path: 'food/foodimg/:food_id', method: RequestMethod.PATCH },
      { path: 'food/foodimg/:food_id', method: RequestMethod.DELETE },
      { path: 'feeds', method: RequestMethod.POST },
      { path: 'feeds/common', method: RequestMethod.POST },
      { path: 'feeds/:id', method: RequestMethod.PATCH },
      { path: 'feeds/:id', method: RequestMethod.DELETE },
      { path: 'feeds/:id/like/user', method: RequestMethod.GET },
      { path: 'feeds/:id/like', method: RequestMethod.POST },
      { path: 'feeds/:id/like', method: RequestMethod.DELETE },
      { path: 'user-actions/favorites', method: RequestMethod.GET },
      { path: 'user-actions/likes', method: RequestMethod.GET },
      { path: 'user-actions/exclude-foods', method: RequestMethod.GET },
      { path: 'user-actions/exclude-ingredients', method: RequestMethod.GET },
      {
        path: 'user-actions/exclude-foods-ingredients',
        method: RequestMethod.GET,
      },
      { path: 'user-actions/favorites', method: RequestMethod.POST },
      { path: 'user-actions/likes', method: RequestMethod.POST },
      { path: 'user-actions/exclude-foods', method: RequestMethod.POST },
      {
        path: 'user-actions/exclude-ingredients',
        method: RequestMethod.POST,
      },
      { path: 'user-actions/favorites-cancel', method: RequestMethod.POST },
      {
        path: 'user-actions/exclude-foods-cancel',
        method: RequestMethod.POST,
      },
      {
        path: 'user-actions/exclude-ingredients-cancel',
        method: RequestMethod.POST,
      },
      {
        path: 'user-actions/random-weighted-foods',
        method: RequestMethod.POST,
      },
    );
  }
}
