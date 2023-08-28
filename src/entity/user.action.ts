import {
  Column,
  PrimaryColumn,
  ManyToOne,
  Entity,
  JoinColumn,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Food } from './food.entity';
import { Ingredient } from './ingredient.entity';

@Entity({ schema: 'finalpj', name: 'user_action' })
export class UserAction {
  @PrimaryGeneratedColumn()
  id: number;
    
  @ManyToOne(() => User, user => user.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user_id: number;

  @ManyToOne(() => Food, food => food.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'food_id' })
  food_id: number;

  @ManyToOne(() => Ingredient, ingredient => ingredient.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ingredient_id' })
  ingredient_id: number;

  @Column('varchar', { length: 20 })
  action: string;

  @Column({ type: 'int' })
  weight: number;

  @CreateDateColumn()
  createdAt: Date;
}
