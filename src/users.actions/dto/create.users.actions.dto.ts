import { IsNumber, IsString } from 'class-validator';

export class CreateFavoriteDto {
  @IsString()
  foodName: string;
}

export class ExcludeFoodDto {
  @IsString()
  foodName: string;
}

export class ExcludeIngredientDto {
  readonly ingredientName: string;
}

export class RandomFoodDto {
  @IsNumber()
  category_id: number;
}