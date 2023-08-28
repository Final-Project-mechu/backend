import {
  Entity,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';
import { User } from './user.entity';
import { Food } from './food.entity';

@Entity({ schema: 'finalpj', name: 'food_user_weight' })
export class FoodUserWeight {
  @PrimaryGeneratedColumn()
  id: number;
      
  @ManyToOne(() => User, user => user.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user_id: number;

  @ManyToOne(() => Food, food => food.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'food_id' })
  food_id: number;

  @Column({ type: 'int' })
  weight: number;
}
