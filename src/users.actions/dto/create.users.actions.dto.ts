import { IsString, IsNumber } from 'class-validator';

export class CreateFavoriteDto {
  @IsString()
  foodName: string;
  @IsNumber()
  userId: number;
}

export class ExcludeFoodDto {
  @IsString()
  foodName: string;
}

export class ExcludeIngredientDto {
  readonly ingredientName: string;
}
