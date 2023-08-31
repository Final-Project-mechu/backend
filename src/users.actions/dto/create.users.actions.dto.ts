import { IsString } from 'class-validator';

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
