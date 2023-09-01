import { Module } from "@nestjs/common";
import { FoodsIngredientsService } from "./foods.ingredients.service";
import { FoodsIngredientsController } from "./foods.ingredients.controller";
import { FoodIngredient } from "src/entity/food.ingredient.entity";
import { Food } from "src/entity/food.entity";
import { Ingredient } from "src/entity/ingredient.entity";
import { User } from "src/entity/user.entity";
import { JwtConfigService } from 'src/config/jwt.config.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [
      TypeOrmModule.forFeature([FoodIngredient,Ingredient,Food,User]),
      JwtModule.registerAsync({
        imports: [ConfigModule],
        useClass: JwtConfigService,
        inject: [ConfigService],
      }),
    ],
    providers: [FoodsIngredientsService],
    controllers: [FoodsIngredientsController]
  })
  export class FoodsIngredientModule {}