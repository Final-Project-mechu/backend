import { Controller, Get, Post, Body } from '@nestjs/common';
import { UsersActionsService } from './users.actions.service';
import {
  CreateFavoriteDto,
  ExcludeFoodDto,
  ExcludeIngredientDto,
} from './dto/create.users.actions.dto';

@Controller('user-action')
export class UsersActionsController {
  constructor(private readonly usersActionsService: UsersActionsService) {}

  @Get('favorite') // contain 으로 변경 고려
  async getFavoriteFoods() {
    return this.usersActionsService.getFavoriteFoodsForUser();
  }

  @Get('like')
  async getLikedFoods() {
    return this.usersActionsService.getLikedFoodsForUser();
  }
  @Get('exclude-foods')
  async getExcludedFoods() {
    return this.usersActionsService.getExcludedFoodsForUser();
  }
  @Get('exclude-ingredients')
  async getExcludedIngredients() {
    return this.usersActionsService.getExcludedIngredientsForUser();
  }
  @Get('exclude-foods-ingredients')
  async getExcludedFoodsIngredients() {
    return this.usersActionsService.getExcludedFoodsIngredientsForUser();
  }

  @Post('favorite')
  async addFavoriteFood(
    @Body() createFavoriteDto: CreateFavoriteDto,
  ): Promise<any> {
    return this.usersActionsService.addFavoriteFood(createFavoriteDto);
  }
  @Post('like')
  addLikeForFood(@Body('foodName') foodName: string) {
    return this.usersActionsService.addLikeForFood(foodName);
  }
  @Post('exclude-foods')
  async excludeFood(@Body() excludeFoodDto: ExcludeFoodDto): Promise<any> {
    return this.usersActionsService.excludeFood(excludeFoodDto.foodName);
  }
  @Post('exclude-ingredients')
  async excludeIngredient(
    @Body() excludeIngredientDto: ExcludeIngredientDto,
  ): Promise<any> {
    return this.usersActionsService.excludeIngredient(
      excludeIngredientDto.ingredientName,
    );
  }
}
