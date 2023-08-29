import { ConflictException, Injectable } from '@nestjs/common';
import _ from 'lodash';
import { Repository } from 'typeorm';
import { Category } from 'src/entity/category.entity';
import { User } from 'src/entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category) private categoryReository: Repository<Category>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  //관리자 판별 메소드
  async getUserInfo(id: number) {
    return await this.userRepository.findOne({
      where: { id },
      select: ['is_admin'],
    });
  }

  //카테고리 생성
  async createCategory(
    id: number,
    category_name: string,
    top_category_id: number,
  ) {
    console.log('요청확인3');
    // const exisAdmin = await this.userRepository.findOne({
    //   where: { is_admin },
    //   select: ['is_admin'],
    // });
    // if (!exisAdmin !== false) {
    //   throw new ConflictException(`관리자 기능입니다.`);
    // }
    console.log('요청확인4');
    await this.categoryReository.insert({
      id,
      category_name,
      top_category_id,
    });

    // query(
    //   `insert into category (category_name , top_category_id)
    //     values ("${category_name}", ${top_category_id})`,
    // );
  }
}
