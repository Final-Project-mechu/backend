import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import _ from 'lodash';
import { Repository } from 'typeorm';
import { Favorite } from 'src/entity/favorite.entity';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorite)
    private favoriteRepository: Repository<Favorite>,
  ) {}
  createFavorite(
    address_name: string,
    road_address_name: string,
    kakao_id: number,
    category_name: string,
    phone: string,
    place_name: string,
    place_url: string,
  ) {
    this.favoriteRepository.query(
      `INSERT INTO favorite (address_name, road_address_name, kakao_id, category_name, phone, place_name, place_url)
       VALUES('${address_name}', '${road_address_name}', ${kakao_id}, '${category_name}', '${phone}', '${place_name}', '${place_url}') `,
    );
    return { message: 'create success' };
  }
  async getFavorites() {
    // 찜한 목록 전체 보기
    return this.favoriteRepository.find();
  }

  async getFavorite(id: number) {
    // 찜한 것 아이디로 찾기
    return await this.favoriteRepository.findOne({
      where: { deletedAt: null, id },
      select: ['id', 'createdAt'],
    });
  }

  async deleteFavorite(favorite_id: number): Promise<void> {
    const findFavorite = await this.getFavorite(favorite_id);
    if (!findFavorite) {
      throw new NotFoundException(`Not found favorite id: ${favorite_id}`);
    }
    await this.favoriteRepository.remove(findFavorite);
  }
}
