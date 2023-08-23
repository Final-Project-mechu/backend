import { Body, Controller, Post } from '@nestjs/common';
import { FavoritesService } from './favorites.service';

@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}
  @Post('/')
  createFavorite(@Body() data) {
    console.log('컨트롤러', data);
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
}
