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
  UseInterceptors,
  UploadedFile,
  Query
} from '@nestjs/common';
import { FoodService } from './food.service';
import { createFoodsDto } from './dto/create.foods.dto';
import { updateFoodsDto } from './dto/update.foods.dto';
import { Request, Response, response } from 'express';
import { Express } from 'express'; 
import { FileInterceptor } from '@nestjs/platform-express';
import { request } from 'http';
import { CreateFoodsImgDto } from './dto/create.foodsimg.dto';
import { async } from 'rxjs';

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

  //@Req() request: RequestWithLocals 받는 메소드
  async reqId (
    @Req() request: RequestWithLocals,
  ){
    const userId = request.locals.user;
    return userId.id;
  }

    // 음식 검색
    @Get('search')
    async searchFood(@Query('q') query: string) {
      return this.foodService.searchFood(query);
    }

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
      return { message: '음식 생성 완료' };
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
    return { message: '음식 변경 완료' };
  }
 
  
  /*=================================================================*/

  //음식 사진까지 해서 생성하기.
  @Post('/foodimg')
  @UseInterceptors(FileInterceptor('file'))
  async createFoodImg(
    @UploadedFile() file: Express.Multer.File,
    @Body() data : CreateFoodsImgDto,
    @Req() request: RequestWithLocals,
  ){
    const user = request.locals.user
    await this.foodService.createFoodImage(
      user.id,
      file,
      data.food_name,
      data.category_id,
    )
    return {messege : "음식정보 게시 완료."};
  }


  //음식 정보 및 사진 추가, 변경
  @Patch('/foodimg/:food_id')
  @UseInterceptors(FileInterceptor('file'))
  async updateFoodImg(
    @UploadedFile() file: Express.Multer.File,
    @Body() data : CreateFoodsImgDto,
    @Req() request: RequestWithLocals,
    @Param('food_id') food_id: number,
  ){
    const user = request.locals.user;
    await this.foodService.updateFoodImage(
      user.id,
      food_id,
      data.food_name,
      data.category_id,
      file,
    );
    return { message : '음식 정보 변경 완료'};
  }


  //삭제하기
  @Delete('/foodimg/:food_id')
  async deleteFoodImg(
    @Req() request: RequestWithLocals,
    @Param('food_id') food_id: number,
  ){
    const user = request.locals.user;
    await this.foodService.deleteFoodImg(
      user.id,
      food_id,
    );
    return { message : '음식 정보 삭제 완료'}
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
