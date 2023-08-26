import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { FavoritesService } from './favorites.service';

@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}
  @Post('/')
  createFavorite(@Body() data): { message: string } {
    return this.favoritesService.createFavorite(
      data.address_name,
      data.road_address_name,
      data.id,
      data.category_name,
      data.phone,
      data.place_name,
      data.place_url,
    );
  }
  @Get('/') // 찜한 목록 전체 보기
  getFavorites() {
    // 유저 아이디 들어가야 함
    return this.favoritesService.getFavorites();
  }
  @Delete('/:id')
  deleteFavorite(@Param() id: number): Promise<void> {
    // 유저 아이디 들어가야 함
    return this.favoritesService.deleteFavorite(id);
  }
}
