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
import { CommentsModule } from './comments/comments.module';
import { AdvertisementsModule } from './advertisements/advertisements.module';
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
import { UserAction } from './entity/user.action';
import { FoodIngredient } from './entity/food.ingredient.entity';
import { Ingredient } from './entity/ingredient.entity';
//import { AuthModule } from './auth/auth.module';
//import { FriendModule } from './friend/friend.module';
import { IngredientModule } from './ingredient/ingredient.module';
import { UsersActionsModule } from './users.actions/users.actions.module';
import { FoodsUsersWeightsModule } from './foods.users.weights/foods.users.weights.module';
import { AuthModule } from './auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { FriendModule } from './friend/friend.module';
import { FriendlistModule } from './friendlist/friendlist.module';
import { FeedsModule } from './feeds/feeds.module';
import { FoodsIngredientsController } from './foods.ingredients/foods.ingredients.controller';
import { FoodsIngredientsService } from './foods.ingredients/foods.ingredients.service';
import { FoodsIngredientModule } from './foods.ingredients/foods.ingredients.module';

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
    FoodUserWeight,
    UserAction,
    FoodIngredient,
    Ingredient,
    Favorite,
    CommentsModule,
    AdvertisementsModule,
    JwtModule,
    FavoritesModule,
    JwtModule,
    MailModule,
    IngredientModule,
    // FriendModule,
    // AuthModule,
    UsersActionsModule,
    FoodsUsersWeightsModule,
    FriendModule,
    AuthModule,
    FriendlistModule,
    FeedsModule,
  ],
  controllers: [AppController, FoodsIngredientsController],
  providers: [AppService, AuthMiddleware, FoodsIngredientsService],
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
        { path: 'feeds', method: RequestMethod.POST },
      );
  }
}