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
import { FoodsIngredientsService } from './foods.ingredients.service';
import { createFoodsIngredientsDto } from './dto/create.foods.ingredients.dto';
import { Request, Response, response } from 'express';

interface RequestWithLocals extends Request {
  locals: {
    user: {
      id: number;
      nick_name: string;
    };
  };
}

@Controller('foods-ingredients')
export class FoodsIngredientsController {
  constructor(
    private readonly foodsIngredientsService: FoodsIngredientsService,
  ) {}

  //푸드 재료 매핑
  @Post('/')
  async createFoodsIngredient(
    @Body() data: createFoodsIngredientsDto,
    @Req() request: RequestWithLocals,
  ) {
    const user = request.locals.user;
    try {
      await this.foodsIngredientsService.createFoodsIngredient(
        user.id,
        data.food_id,
        data.ingredient_id,
      );
      return { message: '푸드 재료 매핑 성공' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}