import {
  Controller,
  Body,
  Delete,
  Get,
  Post,
  Req,
  Res,
  Param,
  BadRequestException,
  Patch,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { createCategoryDto } from './dto/create.category.dto';
import { Request, Response, response } from 'express';
import { request } from 'node:http';
import { updateCategoryDto } from './dto/update.category.dto';

interface RequestWithLocals extends Request {
  locals: {
    user: {
      id: number;
      nick_name: string;
    };
  };
}
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  //카테고리 생성
  @Post('/')
  async createCategory(
    @Body() data: createCategoryDto,
    @Req() request: RequestWithLocals,
  ) {
    const user = request.locals.user;
    try {
      await this.categoryService.createCategory(
        user.id,
        data.category_name,
        data.top_category_id,
      );
      return { message: '카테고리 생성 완료' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  //카테고리 수정 
  @Patch('/:category_id')
  async updateCategory(
    @Body() data: updateCategoryDto,
    @Req() request: RequestWithLocals,
    @Param('category_id') category_id: number,
  ) {
    const user = request.locals.user;
    await this.categoryService.updateCategory(
      user.id,
      category_id,
      data.category_name,
      data.top_category_id,
    );
    return { message: '카테고리 수정 완료' };
  }

  //카테고리 상세
  @Get('/:category_id')
  async getCategory(@Param('category_id') category_id: number) {
    return this.categoryService.getCategory(category_id);
  }

  //카테고리 전체조회
  @Get('/')
  async getCategoryAll() {
    return this.categoryService.getCategoryAll();
  }

  //카테고리 삭제
  @Delete('/:category_id')
  async deleteCategory(
    @Req() request: RequestWithLocals,
    @Param('category_id') category_id: number,
  ) {
    await this.categoryService.deleteCategory(category_id);
    return { message: '카테고리 삭제 완료.' };
  }
}
