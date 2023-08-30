import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
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
    user_id: number,
    address_name: string,
    road_address_name: string,
    kakao_id: number,
    category_name: string,
    phone: string,
    place_name: string,
    place_url: string,
  ) {
    const insertResult = this.favoriteRepository.query(
      `INSERT INTO favorite (user_id, address_name, road_address_name, kakao_id, category_name, phone, place_name, place_url)
       VALUES(${user_id},'${address_name}', '${road_address_name}', ${kakao_id}, '${category_name}', '${phone}', '${place_name}', '${place_url}') `,
    );
    if (insertResult) {
      return { message: 'create success' };
    }
  }

  // user의 찜목록 보기
  async getFavorites(user_id: number) {
    const userFavorites = await this.favoriteRepository.query(`
    SELECT * FROM favorite WHERE user_id = ${user_id} AND deletedAt is null
    `);
    return userFavorites;
  }

  getFavorite({ id }: { id: number }) {
    // 찜한 것 favorite 아이디로 하나 찾기
    console.log('getfavorite부분 favorite_id: ', id);
    const getFavorite = this.favoriteRepository.query(
      `SELECT * FROM favorite f WHERE f.id = ?`,
      [id],
    );
    console.log('getfavorite부분: ', getFavorite);
    return getFavorite;
  }

  async deleteFavorite(user_id: number, id: number) {
    console.log('delete부분 id: ', id);
    const findFavorite = await this.getFavorite({ id });
    console.log('get돌고 난 후: ', findFavorite);
    if (!findFavorite) {
      throw new NotFoundException(`Not found favorite id: ${id}`);
    }
    if (user_id) {
      throw new UnauthorizedException('해당 권한이 없습니다.');
    }
    await this.favoriteRepository.delete(id);
    return { message: 'delete success' };
  }
}
