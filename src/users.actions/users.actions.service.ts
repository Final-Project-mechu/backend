import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserAction } from 'src/entity/user.action';
import { Food } from 'src/entity/food.entity';
import { Ingredient } from 'src/entity/ingredient.entity';
import { CreateFavoriteDto } from './dto/create.users.actions.dto';
import { FoodIngredient } from 'src/entity/food.ingredient.entity';
import { Category } from 'src/entity/category.entity';
import { Between } from 'typeorm';

const FAVORITE_WEIGHT = 10;
const LIKE_WEIGHT = 1;
const EXCLUDE_WEIGHT = -1000;
interface FoodWeight {
  foodId: number;
  categoryId: number;
  weight: number;
  probability?: number;
  cumulativeProbability?: number;
}

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
    @InjectRepository(Category)
    private categoryRepo: Repository<Category>,
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

  // 선호한 음식 조회
  async getFavoriteFoodsForUser(userId: number) {
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
  // 좋아요한 음식 조회
  async getLikedFoodsForUser(userId: number): Promise<string[]> {
    const results = await this.foodRepo
      .createQueryBuilder('f')
      .select('DISTINCT f.food_name', 'foodName')
      .innerJoin('user_action', 'ua', 'ua.food_id = f.id')
      .where('ua.action LIKE :action', { action: 'like' })
      .andWhere('ua.user_id = :userId', { userId })
      .getRawMany();

    return results.map(result => result.foodName);
  }
  // 제외한 음식 조회
  async getExcludedFoodsForUser(userId: number): Promise<string[]> {
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
  // 제외한 재료 조회
  async getExcludedIngredientsForUser(userId: number): Promise<string[]> {
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
  // 제외한 재료에 따른 음식 조회
  async getExcludedFoodsIngredientsForUser(userId: number): Promise<string[]> {
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
  // 선호 음식 추가
  async addFavoriteFood(
    createFavoriteDto: CreateFavoriteDto,
    userId: number,
  ): Promise<any> {
    const { foodName } = createFavoriteDto;
    const foodId = await this.getEntityIdByName(
      this.foodRepo,
      foodName,
      'food_name',
    );
    const totalWeight = await this.getTotalWeightForAction(
      userId,
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
      userId,
      foodId,
      'favorite',
      FAVORITE_WEIGHT,
      'food_id',
    );
  }
  // 좋아한 음식 추가 (좋아요)
  async addLikeForFood(foodName: string, userId: number): Promise<any> {
    const foodId = await this.getEntityIdByName(
      this.foodRepo,
      foodName,
      'food_name',
    );

    // 날짜의 시작과 끝 지정
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // 해당 유저가 오늘 해당 음식에 대해 'like' 액션을 수행했는지 확인
    const existingLike = await this.userActionRepo.findOne({
      where: {
        user_id: userId,
        food_id: foodId,
        action: 'like',
        createdAt: Between(startOfDay, endOfDay),
      },
    });

    // 이미 좋아요를 눌렀다면 메시지를 발생
    if (existingLike) {
      throw new BadRequestException(
        '하루에 한 번만 좋아요를 누를 수 있습니다.',
      );
    }

    // 좋아요가 눌린 내역이 없다면 'like' 액션을 인서트
    return this.insertUserAction(
      userId,
      foodId,
      'like',
      LIKE_WEIGHT,
      'food_id',
    );
  }
  // 제외 음식 추가
  async excludeFood(foodName: string, userId: number): Promise<any> {
    const foodId = await this.getEntityIdByName(
      this.foodRepo,
      foodName,
      'food_name',
    );
    const totalWeight = await this.getTotalWeightForAction(
      userId,
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
      userId,
      foodId,
      'exclude',
      EXCLUDE_WEIGHT,
      'food_id',
    );
  }
  // 제외 재료 추가
  async excludeIngredient(
    ingredientName: string,
    userId: number,
  ): Promise<any> {
    const ingredientId = await this.getEntityIdByName(
      this.ingredientRepo,
      ingredientName,
      'ingredient_name',
    );
    const totalWeight = await this.getTotalWeightForAction(
      userId,
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
        `(${userId}, ${foodId}, ${ingredientIds[index]}, "${actions[index]}", ${weights[index]})`,
    );

    const query = `
    INSERT INTO user_action(user_id, food_id, ingredient_id, action, weight) 
    VALUES ${values.join(',')}
  `;

    return await this.userActionRepo.query(query);
  }
  // 선호한 음식 체크 해제
  async cancelFavoriteFood(
    createFavoriteDto: CreateFavoriteDto,
    userId: number,
  ): Promise<any> {
    const { foodName } = createFavoriteDto;
    const foodId = await this.getEntityIdByName(
      this.foodRepo,
      foodName,
      'food_name',
    );
    const totalWeight = await this.getTotalWeightForAction(
      userId,
      foodId,
      ['favorite', 'favorite_cancel'],
      'food_id',
    );

    if (totalWeight < FAVORITE_WEIGHT - 1) {
      throw new BadRequestException('해당 음식은 선호도 제거가 되어 있습니다.');
    }

    return this.insertUserAction(
      userId,
      foodId,
      'favorite_cancel',
      -FAVORITE_WEIGHT,
      'food_id',
    );
  }
  // 제외한 음식 체크 해제
  async cancelExclusionOfFood(
    createFavoriteDto: CreateFavoriteDto,
    userId: number,
  ): Promise<any> {
    const { foodName } = createFavoriteDto;
    const foodId = await this.getEntityIdByName(
      this.foodRepo,
      foodName,
      'food_name',
    );
    const totalWeight = await this.getTotalWeightForAction(
      userId,
      foodId,
      ['exclude', 'exclude_cancel'],
      'food_id',
    );

    if (totalWeight > EXCLUDE_WEIGHT + 1) {
      throw new BadRequestException('제외 음식이 이미 제거가 되어 있어요.');
    }

    return this.insertUserAction(
      userId,
      foodId,
      'exclude_cancel',
      -EXCLUDE_WEIGHT,
      'food_id',
    );
  }
  // 제외한 재료 체크 해제
  async cancelExclusionIngredient(
    ingredientName: string,
    userId: number,
  ): Promise<any> {
    const ingredientId = await this.getEntityIdByName(
      this.ingredientRepo,
      ingredientName,
      'ingredient_name',
    );
    const totalWeight = await this.getTotalWeightForAction(
      userId,
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
        `(${userId}, ${foodId}, ${ingredientIds[index]}, "${actions[index]}", ${weights[index]})`,
    );

    const query = `
    INSERT INTO user_action(user_id, food_id, ingredient_id, action, weight) 
    VALUES ${values.join(',')}
  `;

    return await this.userActionRepo.query(query);
  }
  // 해당 카테고리와 관련된 모든 하위 카테고리 ID를 가져오는 함수
  async getSubCategories(categoryId: number): Promise<number[]> {
    const subCategories = await this.categoryRepo.find({
      where: { top_category_id: categoryId },
    });
    return subCategories.map(category => category.id);
  }
  // 최상위 카테고리인지 확인하는 함수. catecory 테이블의 top_category_id가 null인 경우
  async isTopLevelCategory(categoryId: number): Promise<boolean> {
    const category = await this.categoryRepo.findOne({
      where: { id: categoryId },
    });
    return category?.top_category_id === null;
  }
  // 음식 추천 룰렛
  async getRandomWeightedFood(
    categoryId: number,
    userId: number,
  ): Promise<string> {
    let relatedCategoryIds = [categoryId];
    if (await this.isTopLevelCategory(categoryId)) {
      relatedCategoryIds = relatedCategoryIds.concat(
        await this.getSubCategories(categoryId),
      );
    }

    const foods = await this.getFoodsByCategoryIds(relatedCategoryIds);
    const foodsWeights = this.calculateBasicWeights(foods);
    const filteredFoods = this.filterFoodsByCategory(
      foodsWeights,
      relatedCategoryIds,
    );
    await this.adjustWeightsByUserActions(filteredFoods, userId);
    const validFoods = this.getValidFoods(filteredFoods);
    this.calculateProbabilities(validFoods);
    const selectedFood = this.performRandomWeightedSelection(validFoods);

    if (!selectedFood) {
      throw new BadRequestException('음식을 선택할 수 없습니다.');
    }
    const food = await this.foodRepo.findOne({
      where: { id: selectedFood.foodId },
    });
    return food?.food_name || '해당 음식을 찾을 수 없습니다.';
  }

  async getFoodsByCategoryIds(relatedCategoryIds: number[]): Promise<Food[]> {
    return await this.foodRepo
      .createQueryBuilder('food')
      .where('food.category_id IN (:...relatedCategoryIds)', {
        relatedCategoryIds,
      })
      .getMany();
  }

  calculateBasicWeights(foods: Food[]): FoodWeight[] {
    return foods.map(food => ({
      foodId: food.id,
      categoryId: food.category_id,
      weight: 10,
    }));
  }

  filterFoodsByCategory(
    foodsWeights: FoodWeight[],
    targetCategoryIds: number[],
  ): FoodWeight[] {
    return foodsWeights.filter(food =>
      targetCategoryIds.includes(food.categoryId),
    );
  }

  async adjustWeightsByUserActions(
    filteredFoods: FoodWeight[],
    userId: number,
  ): Promise<void> {
    for (const foodWeight of filteredFoods) {
      const userActionWeight = await this.userActionRepo
        .createQueryBuilder('ua')
        .select('SUM(ua.weight)', 'totalWeight')
        .where('ua.user_id = :userId', { userId })
        .andWhere('ua.food_id = :foodId', { foodId: foodWeight.foodId })
        .getRawOne();

      const additionalWeight =
        userActionWeight && userActionWeight.totalWeight
          ? parseInt(userActionWeight.totalWeight)
          : 0;
      foodWeight.weight += additionalWeight;
    }
  }

  getValidFoods(filteredFoods: FoodWeight[]): FoodWeight[] {
    return filteredFoods.filter(foodWeight => foodWeight.weight > -500);
  }

  calculateProbabilities(validFoods: FoodWeight[]): void {
    const totalWeight = validFoods.reduce((acc, food) => acc + food.weight, 0);
    validFoods.forEach(food => {
      food.probability = food.weight / totalWeight;
    });

    let cumulativeProbability = 0;
    validFoods.forEach(food => {
      food.cumulativeProbability = cumulativeProbability + food.probability;
      cumulativeProbability = food.cumulativeProbability;
    });
  }

  performRandomWeightedSelection(
    validFoods: FoodWeight[],
  ): FoodWeight | undefined {
    const randomValue = Math.random();
    return validFoods.find((food, index) => {
      if (index === 0) {
        return randomValue < food.cumulativeProbability;
      }
      return (
        randomValue >= validFoods[index - 1].cumulativeProbability &&
        randomValue < food.cumulativeProbability
      );
    });
  }
}
