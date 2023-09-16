// 컨트롤러
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
import { FoodIngredient } from 'src/entity/food.ingredient.entity';

@Controller('foods.ingredients')
export class FoodsIngredientsController {}
