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
} from '@nestjs/common';
import { FoodService } from './food.service';
import { createFoodsDto } from './dto/create.foods.dto';
import { updateFoodsDto } from './dto/update.foods.dto';
import { Request, Response, response } from 'express';
import { Express } from 'express'; 
import { FileInterceptor } from '@nestjs/platform-express';
import { request } from 'http';

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
  async deleteFood(
    @Req() request: RequestWithLocals,
    @Param('id') id: number,
  ) {
    await this.foodService.deleteFood(id);
    return { message: '음식 삭제 완료.' };
  }

  /*=================================================================*/

  //음식 사진까지 해서 생성하기.
  @Post('/foodimg')
  @UseInterceptors(FileInterceptor('file'))
  async createFoodImg(
    @UploadedFile() file: Express.Multer.File,
    @Body() data ,
    //@Req() request: RequestWithLocals,
  ){
    //const userId = request.locals.user
    console.log(file);
    console.log(data);
    //console.log(userId);
    return {messege : "하하하하"};
  }


  //음식 사진만 추가하기
  @Patch('/addfoodimg')
  async updateFoodImg(

  ){
    
  }


  //삭제하기
  @Delete('/deletefoodimg')
  async deleteFoodImg(

  ){
    
  }


  //상세조회하기 -> foodingredient
  @Get('/getfoodimg')
  async getFoodImg(

  ){
    
  }


  //전체 조회하기.
  @Get('/getallfoodimg')
  async getAllFoodImg(

  ){
    
  }

}
