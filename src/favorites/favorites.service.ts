import {
  BadRequestException,
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
  async createFavorite(
    user_id: number,
    address_name: string,
    road_address_name: string,
    kakao_id: number,
    category_name: string,
    phone: string,
    place_name: string,
    place_url: string,
  ) {
    const findKakaoid = await this.favoriteRepository.findOne({
      where: { kakao_id },
    });
    if (findKakaoid) {
      throw new BadRequestException('이미 선택한 상점입니다!');
    }

    const insertResult = this.favoriteRepository.query(
      `INSERT INTO favorite (user_id, address_name, road_address_name, kakao_id, category_name, phone, place_name, place_url)
       VALUES(${user_id},'${address_name}', '${road_address_name}', ${kakao_id}, '${category_name}', '${phone}', '${place_name}', '${place_url}') `,
    );
    if (insertResult) {
      return { message: 'create success' };
    }
  }

  // user의 찜목록 보기
  getFavorite(id: number | string) {
    // 수정된 부분
    // id 값을 숫자로 변환
    const numericId = parseInt(id.toString(), 10);

    // 변환된 값이 NaN인지 확인
    if (isNaN(numericId)) {
      throw new Error(`Invalid ID value: ${id}`);
    }
    return this.favoriteRepository.query(
      `SELECT * FROM favorite f WHERE f.id = ?`,
      [numericId],
    );
  }

  async getFavorites(user_id: number) {
    const userFavorites = await this.favoriteRepository.query(`
    SELECT * FROM favorite WHERE user_id = ${user_id} AND deletedAt is null
    `);
    return userFavorites;
  }

  async deleteFavorite(user_id: number, id: number | string) {
    const findFavoriteArray = await this.getFavorite(id); 
    const findFavorite = findFavoriteArray[0]; 
    if (!findFavorite) {
      throw new NotFoundException(`Not found favorite id: ${id}`);
    }
    // user_id 권한 확인
    if (findFavorite.user_id !== user_id) {
      throw new UnauthorizedException('해당 권한이 없습니다.');
    }
    const numericId = parseInt(id.toString(), 10);
    await this.favoriteRepository.delete(numericId); 
    return { message: 'delete success' };
  }
}
