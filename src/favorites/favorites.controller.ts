import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { Request } from 'express';
interface RequestWithLocals extends Request {
  locals: {
    user: {
      id: number;
      nick_name: string;
    };
  };
}

@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}
  @Post('/')
  async createFavorite(@Body() data, @Req() request: RequestWithLocals) {
    const auth = request.locals.user;
    return await this.favoritesService.createFavorite(
      auth.id,
      data.address_name,
      data.road_address_name,
      data.kakao_id,
      data.category_name,
      data.phone,
      data.place_name,
      data.place_url,
    );
  }
  @Get('/') // 찜한 목록 전체 보기
  getFavorites(@Req() request: RequestWithLocals) {
    const auth = request.locals.user;
    return this.favoritesService.getFavorites(auth.id);
  }
  @Delete('/:id')
  deleteFavorite(@Param() id: number, @Req() request: RequestWithLocals) {
    const auth = request.locals.user;
    return this.favoritesService.deleteFavorite(auth.id, id);
  }
}
