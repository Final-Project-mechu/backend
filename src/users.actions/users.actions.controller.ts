import { Controller, Get, Post, Body } from '@nestjs/common';
import { UsersActionsService } from './users.actions.service';
import {
  CreateFavoriteDto,
  ExcludeFoodDto,
  ExcludeIngredientDto,
  RandomFoodDto,
} from './dto/create.users.actions.dto';

@Controller('user-action')
export class UsersActionsController {
  constructor(private readonly usersActionsService: UsersActionsService) {}

  // GET 엔드 포인트
  @Get('favorite')
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

  // POST 엔드 포인트 추가 생성 
  @Post('favorite')
  async addFavoriteFood(@Body() dto: CreateFavoriteDto) {
    return this.usersActionsService.addFavoriteFood(dto);
  }

  @Post('like')
  async addLikeForFood(@Body() dto: CreateFavoriteDto) {
    return this.usersActionsService.addLikeForFood(dto.foodName);
  }
  @Post('exclude-foods')
  async excludeFood(@Body() dto: ExcludeFoodDto) {
    return this.usersActionsService.excludeFood(dto.foodName);
  }

  @Post('exclude-ingredients')
  async excludeIngredient(@Body() dto: ExcludeIngredientDto) {
    return this.usersActionsService.excludeIngredient(dto.ingredientName);
  }
  // POST 엔드 포인트 cancel 생성 
  @Post('favorite-cancel')
  async cancelFavoriteFood(@Body() dto: CreateFavoriteDto) {
    return this.usersActionsService.cancelFavoriteFood(dto);
  }

  @Post('exclude-foods-cancel')
  async cancelExclusionOfFood(@Body() dto: CreateFavoriteDto) {
    return this.usersActionsService.cancelExclusionOfFood(dto);
  }

  @Post('exclude-ingredients-cancel')
  async cancelExclusionIngredient(@Body() dto: ExcludeIngredientDto) {
    return this.usersActionsService.cancelExclusionIngredient(dto.ingredientName);
  }

  @Post('random-weighted-foods')
async getRandomWeightedFood(@Body() dto: RandomFoodDto) {
    return this.usersActionsService.getRandomWeightedFood(dto.category_id);
}
}
