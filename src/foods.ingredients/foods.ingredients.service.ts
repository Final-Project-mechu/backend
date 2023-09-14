import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import _ from 'lodash';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FoodIngredient } from 'src/entity/food.ingredient.entity';
import { User } from 'src/entity/user.entity';

@Injectable()
export class FoodsIngredientsService {
  constructor(
    @InjectRepository(FoodIngredient)
    private foodingredientReository: Repository<FoodIngredient>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  //관리자 판별 메소드
  async confirmAdmin(user_id) {
    console.log(user_id);
    const confirmAdmin = await this.userRepository.findOne({
      where: { id: user_id },
      select: ['is_admin'],
    });
    return confirmAdmin;
  }

  //푸드 재료 매핑
  async createFoodsIngredient(
    user_id: number,
    food_id: number,
    ingredient_id: number,
  ) {
    console.log(user_id);
    const checkAdmin = await this.confirmAdmin(user_id);
    if (checkAdmin.is_admin !== 1) {
      console.log('관리자가 아닙니다.');
      throw new UnauthorizedException('관리자가 아닙니다.');
    }
    return this.foodingredientReository.insert({
      food_id,
      ingredient_id,
    });
  }

  //음식별 재료 조회
  //재료별 음식 조회
  //푸드 매핑 삭제
}
