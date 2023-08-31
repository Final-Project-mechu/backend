import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Food } from 'src/entity/food.entity';

@Injectable()
export class FoodService {
  constructor(
    @InjectRepository(Food) private foodRepo: Repository<Food>,
  ) {}

  async searchFood(query: string): Promise<Food[]> {
    return await this.foodRepo
      .createQueryBuilder("food")
      .where("food.food_name LIKE :query", { query: `%${query}%` })  // Using ILIKE for case-insensitive search
      .getMany();
  }
}