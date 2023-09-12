import { IsNumber, IsString, Length } from 'class-validator';

export class createIngredientDto {
  @IsString()
  readonly ingredient_name: string;
}
