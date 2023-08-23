import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import _ from 'lodash';
import { Repository } from 'typeorm';
import { Favorate } from 'src/entity/favorate.entity';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorate)
    private favoriteRepository: Repository<Favorate>,
  ) {}
  //   async findUniqueId(kakao_id) {
  //     return await this.favoriteRepository.findOne({});
  //   }
  createFavorite(
    address_name: string,
    road_address_name: string,
    kakao_id: number,
    category_name: string,
    phone: string,
    place_name: string,
    place_url: string,
  ) {
    const createSuccess = this.favoriteRepository.create({
      address_name,
      road_address_name,
      kakao_id,
      category_name,
      phone,
      place_name,
      place_url,
    });
    console.log('서비스확인', createSuccess);
    return { message: 'create success' };
  }
}
