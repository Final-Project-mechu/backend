import { Controller, Get, Post, Body, Req } from '@nestjs/common';
import { UsersActionsService } from './users.actions.service';
import {
  CreateFavoriteDto,
  ExcludeFoodDto,
  ExcludeIngredientDto,
  RandomFoodDto,
} from './dto/create.users.actions.dto';
import { Request } from 'express';

interface RequestWithLocals extends Request {
  locals: {
    user: {
      id: number;
    };
  };
}

@Controller('user-actions')
export class UsersActionsController {
  constructor(private readonly usersActionsService: UsersActionsService) {}
  // 선호한 음식 조회
  @Get('favorites')
  async getFavoriteFoods(@Req() request: RequestWithLocals) {
    const userId = request.locals.user;
    return this.usersActionsService.getFavoriteFoodsForUser(userId.id);
  }
  // 좋아요한 음식 조회
  @Get('likes')
  async getLikedFoods(@Req() request: RequestWithLocals) {
    const userId = request.locals.user;
    return this.usersActionsService.getLikedFoodsForUser(userId.id);
  }
  // 제외한 음식 조회
  @Get('exclude-foods')
  async getExcludedFoods(@Req() request: RequestWithLocals) {
    const userId = request.locals.user;
    return this.usersActionsService.getExcludedFoodsForUser(userId.id);
  }
  // 제외한 재료 조회
  @Get('exclude-ingredients')
  async getExcludedIngredients(@Req() request: RequestWithLocals) {
    const userId = request.locals.user;
    return this.usersActionsService.getExcludedIngredientsForUser(userId.id);
  }
  // 제외한 재료에 따른 음식 조회
  @Get('exclude-foods-ingredients')
  async getExcludedFoodsIngredients(@Req() request: RequestWithLocals) {
    const userId = request.locals.user;
    return this.usersActionsService.getExcludedFoodsIngredientsForUser(
      userId.id,
    );
  }
  // 선호 음식 추가
  @Post('favorites')
  async addFavoriteFood(
    @Body() dto: CreateFavoriteDto,
    @Req() request: RequestWithLocals,
  ) {
    const userId = request.locals.user;
    return this.usersActionsService.addFavoriteFood(dto, userId.id);
  }
  // 좋아한 음식 추가 (좋아요)
  @Post('likes')
  async addLikeForFood(
    @Body() dto: CreateFavoriteDto,
    @Req() request: RequestWithLocals,
  ) {
    const userId = request.locals.user;
    return this.usersActionsService.addLikeForFood(dto.foodName, userId.id);
  }
  // 제외 음식 추가
  @Post('exclude-foods')
  async excludeFood(
    @Body() dto: ExcludeFoodDto,
    @Req() request: RequestWithLocals,
  ) {
    const userId = request.locals.user;
    return this.usersActionsService.excludeFood(dto.foodName, userId.id);
  }
  // 제외 재료 추가
  @Post('exclude-ingredients')
  async excludeIngredient(
    @Body() dto: ExcludeIngredientDto,
    @Req() request: RequestWithLocals,
  ) {
    const userId = request.locals.user;
    return this.usersActionsService.excludeIngredient(
      dto.ingredientName,
      userId.id,
    );
  }
  // 선호한 음식 체크 해제
  @Post('favorites-cancel')
  async cancelFavoriteFood(
    @Body() dto: CreateFavoriteDto,
    @Req() request: RequestWithLocals,
  ) {
    const userId = request.locals.user;
    return this.usersActionsService.cancelFavoriteFood(dto, userId.id);
  }
  // 제외한 음식 체크 해제
  @Post('exclude-foods-cancel')
  async cancelExclusionFood(
    @Body() dto: CreateFavoriteDto,
    @Req() request: RequestWithLocals,
  ) {
    const userId = request.locals.user;
    return this.usersActionsService.cancelExclusionFood(dto, userId.id);
  }
  // 제외한 재료 체크 해제
  @Post('exclude-ingredients-cancel')
  async cancelExclusionIngredient(
    @Body() dto: ExcludeIngredientDto,
    @Req() request: RequestWithLocals,
  ) {
    const userId = request.locals.user;
    return this.usersActionsService.cancelExclusionIngredient(
      dto.ingredientName,
      userId.id,
    );
  }
  // 음식 추천 룰렛
  @Post('random-weighted-foods')
  async randomWeightedFood(
    @Body() dto: RandomFoodDto,
    @Req() request: RequestWithLocals,
  ) {
    const userId = request.locals.user;
    return this.usersActionsService.randomWeightedFood(
      dto.category_id,
      userId.id,
    );
  }
}
