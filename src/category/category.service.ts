import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
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

  //카테고리 생성
  async createCategory(
    id: number,
    category_name: string,
    top_category_id: number,
  ) {
    const confirmAdmin = await this.userRepository.findOne({
      where: { id },
      select: ['is_admin'],
    });

    
    //console.log('confirm.Adminis_admin', confirmAdmin.is_admin);
    if (confirmAdmin.is_admin !== 1) {  
      console.log('관리자가 아닙니다.'); 
      throw new UnauthorizedException('관리자가 아닙니다.');
    }
    return this.categoryReository.insert({
      category_name,
      top_category_id,
    });
  }

  //카테고리 수정
  async updateCategory(
    user_id: number,
    category_id: number,
    category_name: string,
    top_category_id: number,
  ) {
    console.log(category_id);
    const confirmAdmin = await this.userRepository.findOne({
      where: { id: user_id },
      select: ['is_admin'],
    });
    if (confirmAdmin.is_admin !== 1) {
      console.log('관리자가 아닙니다.');
      throw new UnauthorizedException('관리자가 아닙니다.');
    }
    await this.categoryReository.update(category_id, {
      category_name,
      top_category_id,
    });
  }

  //카테고리 상세조회
  async getCategory(category_id) {
    return await this.categoryReository.query(
      `select * from category where id = ${category_id}`,
    );
  }

  //카테고리 전체 조회
  async getCategoryAll() {
    return await this.categoryReository.query(
      `select category_name , top_category_id from category;`,
    );
  }

  //카테고리 삭제
  async deleteCategory(id: number) {
    console.log('ser', id);
    await this.categoryReository.delete({ id });
    //추후 softDelete -> entity에서 date타입을 추가해야함.
    //MissingDeleteDateColumnError: Entity "Category" does not have delete date columns.
  }
}
