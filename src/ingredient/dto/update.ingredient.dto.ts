import { IsNumber, IsString, Length } from 'class-validator';

export class updateIngredientDto {
  @IsString()
  @Length(5, 15)
  readonly ingredient_name: string;
  
}