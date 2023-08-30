import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersActionsService } from './users.actions.service';
import { UsersActionsController } from './users.actions.controller';
import { UserAction } from 'src/entity/user.action';
import { Food } from 'src/entity/food.entity';
import { Ingredient } from 'src/entity/ingredient.entity';
import { FoodIngredient } from 'src/entity/food.ingredient.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserAction, Food, Ingredient, FoodIngredient]),
  ],
  providers: [UsersActionsService],
  controllers: [UsersActionsController],
})
export class UsersActionsModule {}
