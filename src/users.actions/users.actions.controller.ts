import { Controller, Get, Post, Body } from '@nestjs/common';
import { UsersActionsService } from './users.actions.service';
import {
  CreateFavoriteDto,
  ExcludeFoodDto,
  ExcludeIngredientDto,
  RandomFoodDto,
} from './dto/create.users.actions.dto';

@Controller('user-actions')
export class UsersActionsController {
  constructor(private readonly usersActionsService: UsersActionsService) {}

  // GET 엔드 포인트
  // 선호 음식 체크 조회 
  @Get('favorites')
  async getFavoriteFoods() {
    return this.usersActionsService.getFavoriteFoodsForUser();
  }
  // 좋아요한 음식 조회
  @Get('likes')
  async getLikedFoods() {
    return this.usersActionsService.getLikedFoodsForUser();
  }
  // 제외한 음식 조회
  @Get('exclude-foods')
  async getExcludedFoods() {
    return this.usersActionsService.getExcludedFoodsForUser();
  }
  // 제외한 재료 조회 
  @Get('exclude-ingredients')
  async getExcludedIngredients() {
    return this.usersActionsService.getExcludedIngredientsForUser();
  }
  // 제외한 재료에 따른 음식 조회
  @Get('exclude-foods-ingredients')
  async getExcludedFoodsIngredients() {
    return this.usersActionsService.getExcludedFoodsIngredientsForUser();
  }

  // POST 엔드 포인트 추가 생성 
  // 선호 음식 추가
  @Post('favorites')
  async addFavoriteFood(@Body() dto: CreateFavoriteDto) {
    console.log(dto);
    return this.usersActionsService.addFavoriteFood(dto);
  }
  // 좋아한 음식 추가 (좋아요)
  @Post('likes')
  async addLikeForFood(@Body() dto: CreateFavoriteDto) {
    return this.usersActionsService.addLikeForFood(dto.foodName);
  }
  // 제외 음식 추가
  @Post('exclude-foods')
  async excludeFood(@Body() dto: ExcludeFoodDto) {
    return this.usersActionsService.excludeFood(dto.foodName);
  }
  // 제외 재료 추가
  @Post('exclude-ingredients')
  async excludeIngredient(@Body() dto: ExcludeIngredientDto) {
    return this.usersActionsService.excludeIngredient(dto.ingredientName);
  }
  // POST 엔드 포인트 cancel 생성 
  // 선호한 음식 체크 해제
  @Post('favorites-cancel')
  async cancelFavoriteFood(@Body() dto: CreateFavoriteDto) {
    return this.usersActionsService.cancelFavoriteFood(dto);
  }
  // 제외한 음식 체크 해제
  @Post('exclude-foods-cancel')
  async cancelExclusionOfFood(@Body() dto: CreateFavoriteDto) {
    return this.usersActionsService.cancelExclusionOfFood(dto);
  }
  // 제외한 재료 체크 해제
  @Post('exclude-ingredients-cancel')
  async cancelExclusionIngredient(@Body() dto: ExcludeIngredientDto) {
    return this.usersActionsService.cancelExclusionIngredient(dto.ingredientName);
  }
 // 음식 추천 룰렛
  @Post('random-weighted-foods')
async getRandomWeightedFood(@Body() dto: RandomFoodDto) {
    return this.usersActionsService.getRandomWeightedFood(dto.category_id);
}
}
