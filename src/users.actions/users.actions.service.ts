import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserAction } from 'src/entity/user.action';
import { Food } from 'src/entity/food.entity';
import { Ingredient } from 'src/entity/ingredient.entity';
import { CreateFavoriteDto } from './dto/create.users.actions.dto';
import { FoodIngredient } from 'src/entity/food.ingredient.entity';

@Injectable()
export class UsersActionsService {
  constructor(
    @InjectRepository(UserAction)
    private userActionRepo: Repository<UserAction>,
    @InjectRepository(Food)
    private foodRepo: Repository<Food>,
    @InjectRepository(Ingredient)
    private ingredientRepo: Repository<Ingredient>,
    @InjectRepository(FoodIngredient)
    private foodingredientRepo: Repository<FoodIngredient>,
  ) {}

  async getFavoriteFoodsForUser(userId: number = 1): Promise<string[]> {
    const results = await this.foodRepo
      .createQueryBuilder('f')
      .select('f.food_name', 'foodName') // Alias for ease of access
      .leftJoin('user_action', 'ua', 'ua.food_id = f.id')
      .where('ua.user_id = :userId', { userId })
      .andWhere('ua.action IN (:...actions)', {
        actions: ['favorite', 'favorite_cancel'],
      })
      .groupBy('ua.food_id, f.food_name')
      .having('SUM(ua.weight) <> 0')
      .orderBy('f.id', 'ASC')
      .getRawMany();

    return results.map(result => result.foodName);
  }

  async getLikedFoodsForUser(userId: number = 1): Promise<string[]> {
    const results = await this.foodRepo
      .createQueryBuilder('f')
      .select('DISTINCT f.food_name', 'foodName')
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
      .andWhere('ua.action IN (:...actions)', {
        actions: ['exclude', 'exclude_cancel'],
      })
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
      .andWhere('ua.action IN (:...actions)', {
        actions: ['exclude_i', 'exclude_i_cancel'],
      })
      .groupBy('ua.ingredient_id, i.ingredient_name')
      .having('SUM(ua.weight) <> 0')
      .orderBy('i.id', 'ASC')
      .getRawMany();

    return results.map(result => result.ingredientName);
  }

  async getExcludedFoodsIngredientsForUser(userId: number = 1): Promise<string[]> {
    const results = await this.foodRepo
    .createQueryBuilder('f')
    .select('f.food_name', 'foodName')
    .leftJoin('user_action', 'ua', 'ua.food_id = f.id')
    .where('ua.user_id = :userId', { userId })
    .andWhere('ua.action IN (:...actions)', {
      actions: ['exclude_i', 'exclude_i_cancel'],
    })
    .groupBy('ua.food_id, f.food_name')
    .having('SUM(ua.weight) <> 0')
    .orderBy('f.id', 'ASC')
    .getRawMany();
  return results.map(result => result.foodName);

  }



  // POST 방식 시작
  // 선호 음식 추가 
  async addFavoriteFood(createFavoriteDto: CreateFavoriteDto): Promise<any> {
    const { foodName } = createFavoriteDto;

    try {
      const foodIdResult = await this.foodRepo.findOne({
        where: { food_name: foodName },
      });
      if (!foodIdResult) {
        throw new Error('해당 음식은 존재하지 않아요.');
      }

      const foodId = foodIdResult.id;
      const getTotalWeightQuery = `
          SELECT SUM(weight) as totalWeight FROM user_action
          WHERE user_id = 1
          AND food_id = ${foodId}
          AND action IN ('favorite', 'favorite_cancel')
      `;

      const result = await this.userActionRepo.query(getTotalWeightQuery);
      const totalWeight = result[0].totalWeight;
      if (totalWeight > 9) {
        throw new Error('이미 해당 음식이 선호 음식에 추가되어 있습니다.');
      }

      // 리턴
      return this.userActionRepo
        .createQueryBuilder()
        .insert()
        .into('user_action')
        .values({
          user_id: 1, // user_id 1 고정
          food_id: foodIdResult.id,
          action: 'favorite',
          weight: 10,
        })
        .execute();
    } catch (error) {
      throw new Error('음식 추가에 실패했습니다 : ' + error.message);
    }
  }

  // 음식 좋아요 로직. 제한 없음. 다만 가중치  계산 시 +5까지만 받게끔 구현 예정
  async addLikeForFood(foodName: string): Promise<any> {
    try {
      const foodIdResult = await this.foodRepo.findOne({
        where: { food_name: foodName },
      });
      console.log("확인용오옹:",foodIdResult)
      if (!foodIdResult) {
        throw new Error('해당 음식은 존재하지 않아요.');
      }
      return await this.userActionRepo
        .createQueryBuilder()
        .insert()
        .into('user_action')
        .values({
          user_id: 1, // user_id 1 고정
          food_id: foodIdResult.id,
          action: 'like',
          weight: 1,
        })
        .execute();
    } catch (error) {
      throw new Error('음식 좋아요 추가에 실패했습니다 : ' + error.message);
    }
  }

  // 제외 음식
  async excludeFood(foodName: string): Promise<any> {
    try {
      const foodIdResult = await this.foodRepo.findOne({
        where: { food_name: foodName },
      });

      if (!foodIdResult) {
        throw new Error('The food does not exist.');
      }

      const foodId = foodIdResult.id;
      const getTotalWeightQuery = `
            SELECT SUM(weight) as totalWeight FROM user_action
            WHERE user_id = 1
            AND food_id = ${foodId}
            AND action IN ('exclude', 'exclude_cancel')
        `;

      const result = await this.userActionRepo.query(getTotalWeightQuery);
      const totalWeight = result[0].totalWeight;
      console.log('냠냠:', totalWeight);

      if (totalWeight < -999) {
        throw new Error('이미 해당 음식이 제외 음식에 추가되어 있습니다.');
      }

      return this.userActionRepo
        .createQueryBuilder()
        .insert()
        .into('user_action')
        .values({
          user_id: 1,
          food_id: foodIdResult.id,
          action: 'exclude',
          weight: -1000,
        })
        .execute();
    } catch (error) {
      throw new Error('Failed to exclude the food: ' + error.message);
    }
  }

  // 제외 재료
  async excludeIngredient(ingredientName: string): Promise<any> {
    try {
        // 1. Check if the ingredient exists
        const ingredientResult = await this.ingredientRepo.findOne({
            where: { ingredient_name: ingredientName },
        });

        if (!ingredientResult) {
            throw new Error('The ingredient does not exist.');
        }

        const ingredientId = ingredientResult.id;
        const userId = 1;

        // Check total weight for this ingredient
        const getTotalWeightQuery = `
            SELECT SUM(weight) as totalWeight 
            FROM user_action 
            WHERE user_id = ? 
            AND ingredient_id = ? 
            AND action IN ('exclude_i', 'exclude_i_cancel');
        `;

        const result = await this.userActionRepo.query(getTotalWeightQuery, [userId, ingredientId]);
        const totalWeight = result[0].totalWeight;

        if (totalWeight < -999) {
            throw new Error('제외 재료가 이미 추가가 되어 있어요.');
        }

        const getFoodIdQuery = `
            SELECT food_id 
            FROM food_ingredient 
            WHERE ingredient_id = ?
        `;

        const foodIdResult = await this.foodingredientRepo.query(getFoodIdQuery, [ingredientId]);
        const foodIds = foodIdResult.map(item => item.food_id);

        if (!foodIds.length) {
            throw new Error('제외 재료에 따른 음식이 없어요.');
        }

        const actions = Array(foodIds.length).fill('exclude_i');
        const weights = Array(foodIds.length).fill(-1000);
        const ingredientIds = Array(foodIds.length).fill(ingredientId);

        // Create an array of value strings
        const values = foodIds.map((foodId, index) => 
            `(${userId}, ${foodId}, ${ingredientIds[index]}, "${actions[index]}", ${weights[index]})`
        );

        const query = `
            INSERT INTO user_action(user_id, food_id, ingredient_id, action, weight) 
            VALUES ${values.join(',')}
        `;

        return await this.userActionRepo.query(query);
    } catch (error) {
        throw error;
    }
}

  // 체크 해제 POST
  async cancelFavoriteFood(createFavoriteDto: CreateFavoriteDto): Promise<any> {
    const { foodName } = createFavoriteDto;

    try {
      const foodIdResult = await this.foodRepo.findOne({
        where: { food_name: foodName },
      });
      if (!foodIdResult) {
        throw new Error('해당 음식은 없습니다.');
      }

      const foodId = foodIdResult.id;
      const totalWeight = await this.userActionRepo
          .createQueryBuilder('user_action')
          .select('SUM(user_action.weight)', 'totalWeight')
          .where('user_id = :userId', { userId: 1 })
          .andWhere('food_id = :foodId', { foodId: foodId })
          .andWhere('action IN (:...actions)', { actions: ['favorite', 'favorite_cancel'] })
          .getRawOne();

      if (totalWeight.totalWeight < 9) {
        throw new Error('해당 음식은 선호도 제거가 되어 있습니다.');
      }

      return this.userActionRepo
        .createQueryBuilder()
        .insert()
        .into('user_action')
        .values({
          user_id: 1, 
          food_id: foodId,
          action: 'favorite_cancel',
          weight: -10
        })
        .execute();
    } catch (error) {
      throw new Error('Failed to cancel favorite food: ' + error.message);
    }
}
  // 제외 음식 체크 해제 
  async cancelExclusionOfFood(createFavoriteDto: CreateFavoriteDto): Promise<any> {
  const { foodName } = createFavoriteDto;
  try {
      const foodIdResult = await this.foodRepo.findOne({
          where: { food_name: foodName },
      });

      if (!foodIdResult) {
          throw new Error('해당 음식 없어요');
      }

      const foodId = foodIdResult.id;
      const totalWeight = await this.userActionRepo
          .createQueryBuilder('user_action')
          .select('SUM(user_action.weight)', 'totalWeight')
          .where('user_id = :userId', { userId: 1 })
          .andWhere('food_id = :foodId', { foodId: foodId })
          .andWhere('action IN (:...actions)', { actions: ['exclude', 'exclude_cancel'] })
          .getRawOne();

      if (totalWeight.totalWeight > -999) {
          throw new Error('제외 음식이 이미 제거가 되어 있어요.');
      }

      return this.userActionRepo
          .createQueryBuilder()
          .insert()
          .into('user_action')
          .values({
              user_id: 1,
              food_id: foodId,
              action: 'exclude_cancel',
              weight: 1000
          })
          .execute();
  } catch (error) {
      throw new Error('Failed to cancel the exclusion of food: ' + error.message);
  }
} 
  // 제외 재료 체크 해제
  async cancelExclusionIngredient(ingredientName: string): Promise<any> {
    try {
        const ingredientResult = await this.ingredientRepo.findOne({
            where: { ingredient_name: ingredientName },
        });

        if (!ingredientResult) {
            throw new Error('The ingredient does not exist.');
        }

        const ingredientId = ingredientResult.id;
        const userId = 1;  // TODO: Fetch this dynamically

        // Check total weight for this ingredient
        const getTotalWeightQuery = `
            SELECT SUM(weight) as totalWeight 
            FROM user_action 
            WHERE user_id = ? 
            AND ingredient_id = ? 
            AND action IN ('exclude_i', 'exclude_i_cancel');
        `;

        const result = await this.userActionRepo.query(getTotalWeightQuery, [userId, ingredientId]);
        const totalWeight = result[0].totalWeight;

        if (totalWeight > -999) {
            throw new Error('제외 재료가 이미 제거가 되어 있어요.');
        }

        const getFoodIdQuery = `
            SELECT food_id 
            FROM food_ingredient 
            WHERE ingredient_id = ?
        `;

        const foodIdResult = await this.foodingredientRepo.query(getFoodIdQuery, [ingredientId]);
        const foodIds = foodIdResult.map(item => item.food_id);

        if (!foodIds.length) {
            throw new Error('제외 재료에 따른 음식이 없어요.');
        }

        const actions = Array(foodIds.length).fill('exclude_i_cancel');
        const weights = Array(foodIds.length).fill(1000);
        const ingredientIds = Array(foodIds.length).fill(ingredientId);


        const values = foodIds.map((foodId, index) => 
            `(${userId}, ${foodId}, ${ingredientIds[index]}, "${actions[index]}", ${weights[index]})`
        );

        const query = `
            INSERT INTO user_action(user_id, food_id, ingredient_id, action, weight) 
            VALUES ${values.join(',')}
        `;

        return await this.userActionRepo.query(query);
    } catch (error) {
        throw error;
    }
}
}
