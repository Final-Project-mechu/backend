import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import _ from 'lodash';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Ingredient } from 'src/entity/ingredient.entity';
import { User } from 'src/entity/user.entity';

@Injectable()
export class IngredientService {
  constructor(
    @InjectRepository(Ingredient)
    private ingredientReository: Repository<Ingredient>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  //재료 생성
  async createIngredient(user_id: number, ingredient_name: string) {
    const confirmAdmin = await this.userRepository.findOne({
      where: { id: user_id },
      select: ['is_admin'],
    });
    return this.ingredientReository.insert({
      ingredient_name,
    });
  }

  //재료 수정
  async updateIngredient(
    user_id: number,
    ingredient_id: number,
    ingredient_name: string,
  ) {
    const confirmAdmin = await this.userRepository.findOne({
      where: { id: user_id },
      select: ['is_admin'],
    });

    await this.ingredientReository.update(ingredient_id, {
      ingredient_name,
    });
  }

  //카테고리 상세조회
  async getIngredient(ingredient_id) {
    return await this.ingredientReository.query(
      `select * from ingredient where id = ${ingredient_id}`,
    );
  }

  //카테고리 전체 조회
  async getIngredientAll() {
    return await this.ingredientReository.query(`select * from ingredient;`);
  }

  //재료 삭제
  async deleteIngredient(id: number) {
    console.log('ser', id);
    await this.ingredientReository.delete({ id });
  }
}
