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
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { createCategoryDto } from './dto/create.category.dto';
// import { Request, Response, response } from 'express';

interface RequestWithLocals extends Request {
  locals: {
    user: {
      id: number;
      category_name: string;
    };
  };
}

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  //카테고리 생성
  @Post()
  async createCategory(
    @Body() data: createCategoryDto,
    @Req() request: RequestWithLocals,
  ) {
    const auth = request.locals.user;
    try {
      await this.categoryService.createCategory(
        auth.id,
        data.category_name,
        data.top_category_id,
      );
      return { message: '카테고리 생성 완료' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
