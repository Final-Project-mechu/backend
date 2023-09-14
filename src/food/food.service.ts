import {
  ConflictException,
  Injectable,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import _ from 'lodash';
import { Repository } from 'typeorm';
import { Food } from 'src/entity/food.entity';
import { User } from 'src/entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { S3Service } from 'src/aws/s3.service';

@Injectable()
export class FoodService {
  constructor(
    @InjectRepository(Food) private foodReository: Repository<Food>,
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly s3Service: S3Service,
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
    // if (checkAdmin.is_admin !== 1) {
    //   console.log('관리자가 아닙니다.');
    //   throw new UnauthorizedException('관리자가 아닙니다.');
    // }
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
    // if (checkAdmin.is_admin !== 1) {
    //   console.log('관리자가 아닙니다.');
    //   throw new UnauthorizedException('관리자가 아닙니다.');
    // }
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
  // async getFood(food_id: number) {
  //   return await this.foodReository.query(
  //     `select * from food where id = ${food_id}`,
  //   );
  // }
  async getFood(food_id: number) {
    return await this.foodReository.query(
      `select distinct f.id , f.food_name , f.category_id , food_img , fi.food_id ,fi.ingredient_id ,i.ingredient_name  from food f
      left join food_ingredient fi on f.id  = fi.food_id 
      left join ingredient i on fi.ingredient_id = i.id 
      where f.id  = ${food_id}`,
    );
  }

  //음식삭제
  async deleteFood(id: number) {
    await this.foodReository.delete({ id });
    //추후 softDelete -> entity에서 date타입을 추가해야함.
    //MissingDeleteDateColumnError: Entity "Category" does not have delete date columns.
  }

  //음식 사진까지 해서 생성하기.
  async createFoodImage(
    id: number,
    file: Express.Multer.File,
    food_name: string,
    category_id: number,
  ) {
    const checkAdmin = await this.confirmAdmin(id);
    if (checkAdmin.is_admin !== 1) {
      console.log('관리자가 아닙니다.');
      throw new UnauthorizedException('관리자가 아닙니다.');
    }
    if (file) {
      const food_img = await this.s3Service.putObject(file);
      return this.foodReository.insert({
        food_name,
        category_id,
        food_img,
      });
    } else {
      //예외처리 다듬어야함.
      throw new Error('파일이 없습니다.');
    }
  }

  //음식 정보 수정 및 사진 추가하기
  async updateFoodImage(
    id: number,
    food_id: number,
    food_name: string,
    category_id: number,
    file: Express.Multer.File,
  ) {
    const checkAdmin = await this.confirmAdmin(id);
    if (checkAdmin.is_admin !== 1) {
      console.log('관리자가 아닙니다.');
      throw new UnauthorizedException('관리자가 아닙니다.');
    }
    const food_img = await this.s3Service.putObject(file);

    return this.foodReository.update(food_id, {
      food_name,
      category_id,
      food_img,
    });
  }

  //삭제하기
  // 디비에서 에서 삭제 /  S3 버켓에서 삭제 ~
  async deleteFoodImg(id: number, food_id: number) {
    const checkAdmin = await this.confirmAdmin(id);
    if (checkAdmin.is_admin !== 1) {
      console.log('관리자가 아닙니다.');
      throw new UnauthorizedException('관리자가 아닙니다.');
    }
    this.foodReository.softDelete({ id: food_id });
  }

  //상세조회하기 -> foodingredient
  //전체 조회하기
  async getAllFoodImg() {
    return await this.foodReository.query(`select * from food;`);
  }



  // 음식 검색 
  async searchFood(query: string): Promise<Food[]> {
    if (!query) {
      throw new BadRequestException('해당 음식은 존재하지 않습니다.');
    }
    return await this.foodReository
      .createQueryBuilder("food")
      .where("food.food_name LIKE :query", { query: `%${query}%` })
      .getMany();
  }
}

