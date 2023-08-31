import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import _ from 'lodash';
import { Repository } from 'typeorm';
import { Food } from 'src/entity/food.entity';
import { User } from 'src/entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class FoodService {
  constructor(
    @InjectRepository(Food) private foodReository: Repository<Food>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  //관리자 판별 메소드
  async confirmAdmin(id) {
    const confirmAdmin = await this.userRepository.findOne({
      where: { id },
      select: ['is_admin'],
    });
    return confirmAdmin;
  }

  //음식 생성
  async createFood(id: number, food_name: string, category_id: number) {
    const checkAdmin = await this.confirmAdmin(id);
    if (checkAdmin.is_admin !== 1) {
      console.log('관리자가 아닙니다.');
      throw new UnauthorizedException('관리자가 아닙니다.');
    }
    return this.foodReository.insert({
      food_name,
      category_id,
    });
  }

  //음식 수정
  async updateFood(
    id: number,
    food_id: number,
    food_name: string,
    category_id: number,
  ) {
    const checkAdmin = await this.confirmAdmin(id);
    if (checkAdmin.is_admin !== 1) {
      console.log('관리자가 아닙니다.');
      throw new UnauthorizedException('관리자가 아닙니다.');
    }
    return this.foodReository.update(food_id, {
      food_name,
      category_id,
    });
  }

  //음식 전체조회
  async getFoodAll() {
    return await this.foodReository.query(`select * from food;`);
  }

  //음식 상세조회
  /* 조회하는 방법에 대해서 생각해 봐야함 
       Parms, Body, Locals로 조회 등등등*/
  async getFood(food_id: number) {
    return await this.foodReository.query(
      `select * from food where id = ${food_id}`,
    );
  }

  //음식삭제
  async deleteFood(id: number) {
    await this.foodReository.delete({ id });
    //추후 softDelete -> entity에서 date타입을 추가해야함.
    //MissingDeleteDateColumnError: Entity "Category" does not have delete date columns.
  }
}
