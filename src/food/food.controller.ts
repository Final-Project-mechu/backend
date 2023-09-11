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
import { FoodService } from './food.service';
import { createFoodsDto } from './dto/create.foods.dto';
import { updateFoodsDto } from './dto/update.foods.dto';
import { Request, Response, response } from 'express';

interface RequestWithLocals extends Request {
  locals: {
    user: {
      id: number;
      nick_name: string;
    };
  };
}

@Controller('food')
export class FoodController {
  constructor(private readonly foodService: FoodService) {}

  //음식 생성
  @Post('/')
  async createFood(
    @Body() data: createFoodsDto,
    @Req() request: RequestWithLocals,
  ) {
    const user = request.locals.user;
    try {
      await this.foodService.createFood(
        user.id,
        data.food_name,
        data.category_id,
      );
      return { message: '카테고리 생성 완료' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  //음식 수정
  @Patch('/:food_id')
  async updateFood(
    @Body() data: updateFoodsDto,
    @Req() request: RequestWithLocals,
    @Param('food_id') food_id: number,
  ) {
    const user = request.locals.user;
    await this.foodService.updateFood(
      user.id,
      food_id,
      data.food_name,
      data.category_id,
    );
  }

  //음식 전체조회
  @Get('/')
  async getFoodAll() {
    return this.foodService.getFoodAll();
  }

  //음식 상세조회
  /* 조회하는 방법에 대해서 생각해 봐야함 
       Parms, Body, Locals로 조회 등등등*/
  @Get('/:id')
  async getFood(@Param('id') id: number) {
    return this.foodService.getFood(id);
  }

  //음식삭제
  @Delete('/:id')
  async deleteFood(@Req() request: RequestWithLocals, @Param('id') id: number) {
    await this.foodService.deleteFood(id);
    return { message: '카테고리 삭제 완료.' };
  }
}
