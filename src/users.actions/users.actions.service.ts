import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserAction } from 'src/entity/user.action';
import { Food } from 'src/entity/food.entity';
import { Ingredient } from 'src/entity/ingredient.entity';

@Injectable()
export class UsersActionsService {
  constructor(
    @InjectRepository(UserAction)
    private userActionRepo: Repository<UserAction>,
    @InjectRepository(Food) private foodRepo: Repository<Food>,
    @InjectRepository(Ingredient) private ingredientRepo: Repository<Ingredient>,
  ) {}

  async getFavoriteFoodsForUser(userId: number = 1): Promise<string[]> {
    const results = await this.foodRepo
      .createQueryBuilder('f')
      .select('f.food_name', 'foodName') // Alias for ease of access
      .leftJoin('user_action', 'ua', 'ua.food_id = f.id')
      .where('ua.user_id = :userId', { userId })
      .andWhere('ua.action IN (:...actions)', {
        actions: ['favorite', 'favorite_cancle'],
      })
      .groupBy('ua.food_id, f.food_name')
      .having('SUM(ua.weight) <> 0')
      .orderBy('f.id', 'ASC')
      .getRawMany();

    return results.map(result => result.foodName); // Use the aliased name
  }

  async getLikedFoodsForUser(userId: number = 1): Promise<string[]> {
    const results = await this.foodRepo
      .createQueryBuilder('f')
      .select('DISTINCT f.food_name', 'foodName') // Use DISTINCT here
      .innerJoin('user_action', 'ua', 'ua.food_id = f.id')
      .where('ua.action LIKE :action', { action: 'like' })
      .andWhere('ua.user_id = :userId', { userId })
      .getRawMany();

    return results.map(result => result.foodName);
}

async getExcludedFoodsForUser(userId: number = 1): Promise<string[]> {
  const results = await this.foodRepo
    .createQueryBuilder('f')
    .select('f.food_name', 'foodName')
    .leftJoin('user_action', 'ua', 'ua.food_id = f.id')
    .where('ua.user_id = :userId', { userId })
    .andWhere('ua.action IN (:...actions)', { actions: ["exclude", "exclude_cansle"] })
    .groupBy('ua.food_id, f.food_name')
    .having('SUM(ua.weight) <> 0')
    .orderBy('f.id', 'ASC')
    .getRawMany();

  return results.map(result => result.foodName);
}

async getExcludedIngredientsForUser(userId: number = 1): Promise<string[]> {
  const results = await this.ingredientRepo
    .createQueryBuilder('i')
    .select('i.ingredient_name', 'ingredientName')
    .leftJoin('user_action', 'ua', 'ua.ingredient_id = i.id')
    .where('ua.user_id = :userId', { userId })
    .andWhere('ua.action IN (:...actions)', { actions: ["exclude_i", "exclude_i_cancle"] })
    .groupBy('ua.ingredient_id, i.ingredient_name')
    .having('SUM(ua.weight) <> 0')
    .orderBy('i.id', 'ASC')
    .getRawMany();

  return results.map(result => result.ingredientName);
}

}
