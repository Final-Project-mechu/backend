import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserAction } from 'src/entity/user.action';
import { Food } from 'src/entity/food.entity';
import { Ingredient } from 'src/entity/ingredient.entity';
import { CreateFavoriteDto } from './dto/create.users.actions.dto';
import { FoodIngredient } from 'src/entity/food.ingredient.entity';

const DEFAULT_USER_ID = 1;
const FAVORITE_WEIGHT = 10;
const LIKE_WEIGHT = 1;
const EXCLUDE_WEIGHT = -1000;

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

  private async getEntityIdByName(
    repo: Repository<any>,
    name: string,
    columnName: string,
  ): Promise<number> {
    const entity = await repo.findOne({ where: { [columnName]: name } });
    if (!entity) {
      throw new BadRequestException(`${name}가 존재하지 않습니다.`);
    }
    return entity.id;
  }

  private async getTotalWeightForAction(
    userId: number,
    entityId: number,
    actions: string[],
    columnName: string,
  ): Promise<number> {
    const result = await this.userActionRepo
      .createQueryBuilder('user_action')
      .select('SUM(user_action.weight)', 'totalWeight')
      .where(`user_id = :userId`, { userId })
      .andWhere(`${columnName} = :entityId`, { entityId })
      .andWhere('action IN (:...actions)', { actions })
      .getRawOne();
    return result.totalWeight || 0;
  }

  private async insertUserAction(
    userId: number,
    entityId: number,
    action: string,
    weight: number,
    columnName: string,
  ): Promise<any> {
    return this.userActionRepo
      .createQueryBuilder()
      .insert()
      .into('user_action')
      .values({
        user_id: userId,
        [columnName]: entityId,
        action,
        weight,
      })
      .execute();
  }

  async getFavoriteFoodsForUser(
    userId: number = DEFAULT_USER_ID,
  ): Promise<string[]> {
    const results = await this.foodRepo
      .createQueryBuilder('f')
      .select('f.food_name', 'foodName')
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

  async getLikedFoodsForUser(
    userId: number = DEFAULT_USER_ID,
  ): Promise<string[]> {
    const results = await this.foodRepo
      .createQueryBuilder('f')
      .select('DISTINCT f.food_name', 'foodName')
      .innerJoin('user_action', 'ua', 'ua.food_id = f.id')
      .where('ua.action LIKE :action', { action: 'like' })
      .andWhere('ua.user_id = :userId', { userId })
      .getRawMany();

    return results.map(result => result.foodName);
  }

  async getExcludedFoodsForUser(
    userId: number = DEFAULT_USER_ID,
  ): Promise<string[]> {
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

  async getExcludedIngredientsForUser(
    userId: number = DEFAULT_USER_ID,
  ): Promise<string[]> {
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

  async getExcludedFoodsIngredientsForUser(
    userId: number = DEFAULT_USER_ID,
  ): Promise<string[]> {
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

  async addFavoriteFood(createFavoriteDto: CreateFavoriteDto): Promise<any> {
    const { foodName } = createFavoriteDto;
    const foodId = await this.getEntityIdByName(
      this.foodRepo,
      foodName,
      'food_name',
    );
    const totalWeight = await this.getTotalWeightForAction(
      DEFAULT_USER_ID,
      foodId,
      ['favorite', 'favorite_cancel'],
      'food_id',
    );

    if (totalWeight > FAVORITE_WEIGHT - 1) {
      throw new BadRequestException(
        '이미 해당 음식이 선호 음식에 추가되어 있습니다.',
      );
    }

    return this.insertUserAction(
      DEFAULT_USER_ID,
      foodId,
      'favorite',
      FAVORITE_WEIGHT,
      'food_id',
    );
  }

  async addLikeForFood(foodName: string): Promise<any> {
    const foodId = await this.getEntityIdByName(
      this.foodRepo,
      foodName,
      'food_name',
    );
    return this.insertUserAction(
      DEFAULT_USER_ID,
      foodId,
      'like',
      LIKE_WEIGHT,
      'food_id',
    );
  }

  async excludeFood(foodName: string): Promise<any> {
    const foodId = await this.getEntityIdByName(
      this.foodRepo,
      foodName,
      'food_name',
    );
    const totalWeight = await this.getTotalWeightForAction(
      DEFAULT_USER_ID,
      foodId,
      ['exclude', 'exclude_cancel'],
      'food_id',
    );

    if (totalWeight < EXCLUDE_WEIGHT + 1) {
      throw new BadRequestException(
        '이미 해당 음식이 제외 음식에 추가되어 있습니다.',
      );
    }

    return this.insertUserAction(
      DEFAULT_USER_ID,
      foodId,
      'exclude',
      EXCLUDE_WEIGHT,
      'food_id',
    );
  }

  async excludeIngredient(ingredientName: string): Promise<any> {
    const ingredientId = await this.getEntityIdByName(
      this.ingredientRepo,
      ingredientName,
      'ingredient_name',
    );
    const totalWeight = await this.getTotalWeightForAction(
      DEFAULT_USER_ID,
      ingredientId,
      ['exclude_i', 'exclude_i_cancel'],
      'ingredient_id',
    );

    if (totalWeight < EXCLUDE_WEIGHT + 1) {
      throw new BadRequestException('제외 재료가 이미 추가가 되어 있어요.');
    }

    const foodIds = (
      await this.foodingredientRepo
        .createQueryBuilder('fi')
        .select('fi.food_id', 'foodId')
        .where('fi.ingredient_id = :ingredientId', { ingredientId })
        .getRawMany()
    ).map(result => result.foodId);

    if (!foodIds.length) {
      throw new BadRequestException('제외 재료에 따른 음식이 없어요.');
    }

    const actions = Array(foodIds.length).fill('exclude_i');
    const weights = Array(foodIds.length).fill(EXCLUDE_WEIGHT);
    const ingredientIds = Array(foodIds.length).fill(ingredientId);

    const values = foodIds.map(
      (foodId, index) =>
        `(${DEFAULT_USER_ID}, ${foodId}, ${ingredientIds[index]}, "${actions[index]}", ${weights[index]})`,
    );

    const query = `
      INSERT INTO user_action(user_id, food_id, ingredient_id, action, weight) 
      VALUES ${values.join(',')}
    `;

    return await this.userActionRepo.query(query);
  }

  async cancelFavoriteFood(createFavoriteDto: CreateFavoriteDto): Promise<any> {
    const { foodName } = createFavoriteDto;
    const foodId = await this.getEntityIdByName(
      this.foodRepo,
      foodName,
      'food_name',
    );
    const totalWeight = await this.getTotalWeightForAction(
      DEFAULT_USER_ID,
      foodId,
      ['favorite', 'favorite_cancel'],
      'food_id',
    );

    if (totalWeight < FAVORITE_WEIGHT - 1) {
      throw new BadRequestException('해당 음식은 선호도 제거가 되어 있습니다.');
    }

    return this.insertUserAction(
      DEFAULT_USER_ID,
      foodId,
      'favorite_cancel',
      -FAVORITE_WEIGHT,
      'food_id',
    );
  }

  async cancelExclusionOfFood(
    createFavoriteDto: CreateFavoriteDto,
  ): Promise<any> {
    const { foodName } = createFavoriteDto;
    const foodId = await this.getEntityIdByName(
      this.foodRepo,
      foodName,
      'food_name',
    );
    const totalWeight = await this.getTotalWeightForAction(
      DEFAULT_USER_ID,
      foodId,
      ['exclude', 'exclude_cancel'],
      'food_id',
    );

    if (totalWeight > EXCLUDE_WEIGHT + 1) {
      throw new BadRequestException('제외 음식이 이미 제거가 되어 있어요.');
    }

    return this.insertUserAction(
      DEFAULT_USER_ID,
      foodId,
      'exclude_cancel',
      -EXCLUDE_WEIGHT,
      'food_id',
    );
  }

  async cancelExclusionIngredient(ingredientName: string): Promise<any> {
    const ingredientId = await this.getEntityIdByName(
      this.ingredientRepo,
      ingredientName,
      'ingredient_name',
    );
    const totalWeight = await this.getTotalWeightForAction(
      DEFAULT_USER_ID,
      ingredientId,
      ['exclude_i', 'exclude_i_cancel'],
      'ingredient_id',
    );

    if (totalWeight > EXCLUDE_WEIGHT + 1) {
      throw new BadRequestException('제외 재료가 이미 제거가 되어 있어요.');
    }

    const foodIds = (
      await this.foodingredientRepo
        .createQueryBuilder('fi')
        .select('fi.food_id', 'foodId')
        .where('fi.ingredient_id = :ingredientId', { ingredientId })
        .getRawMany()
    ).map(result => result.foodId);

    if (!foodIds.length) {
      throw new BadRequestException('제외 재료에 따른 음식이 없어요.');
    }

    const actions = Array(foodIds.length).fill('exclude_i_cancel');
    const weights = Array(foodIds.length).fill(-EXCLUDE_WEIGHT);
    const ingredientIds = Array(foodIds.length).fill(ingredientId);

    const values = foodIds.map(
      (foodId, index) =>
        `(${DEFAULT_USER_ID}, ${foodId}, ${ingredientIds[index]}, "${actions[index]}", ${weights[index]})`,
    );

    const query = `
      INSERT INTO user_action(user_id, food_id, ingredient_id, action, weight) 
      VALUES ${values.join(',')}
    `;

    return await this.userActionRepo.query(query);
  }
}
