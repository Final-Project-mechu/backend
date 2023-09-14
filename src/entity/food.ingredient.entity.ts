import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Food } from './food.entity';
import { Ingredient } from './ingredient.entity';

@Entity({ schema: 'finalpj', name: 'food_ingredient' })
export class FoodIngredient {
  @PrimaryColumn()
  @ManyToOne(() => Food, food => food.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'food_id' })
  food_id: number;

  @PrimaryColumn()
  @ManyToOne(() => Ingredient, ingredient => ingredient.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'ingredient_id' })
  ingredient_id: number;
}
