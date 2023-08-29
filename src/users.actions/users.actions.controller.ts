import { Controller, Get } from '@nestjs/common';
import { UsersActionsService } from './users.actions.service';

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

}
