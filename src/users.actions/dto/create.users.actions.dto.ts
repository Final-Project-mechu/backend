import { IsString } from 'class-validator';
import { Column } from 'typeorm';

export class CreateFavoriteDto {
  @IsString()
  foodName: string;
  @Column()
  userId: number;
}

export class ExcludeFoodDto {
  @IsString()
  foodName: string;
}

export class ExcludeIngredientDto {
  readonly ingredientName: string;
}
