  import {
    Entity,
    PrimaryColumn,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';
  import { User } from './user.entity';
  import { Ingredient } from './ingredient.entity';
  
  @Entity({ schema: 'finalpj', name: 'user_disliked_ingredient' })
  export class UserDislikedIngredient {
    @PrimaryColumn()
    @ManyToOne(() => User, user => user.id, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user_id: User;
  
    //@PrimaryColumn()
    @ManyToOne(() => Ingredient, ingredient => ingredient.id, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'ingredient_id' })
    ingredient_id: Ingredient;
  }