import { IsNumber, IsString, Length } from 'class-validator';

export class updateIngredientDto {
  @IsString()
  readonly ingredient_name: string;
  
}