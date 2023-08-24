import {
  Entity,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
  Column,
} from 'typeorm';
import { Food } from './food.entity';
import { User } from './user.entity';

@Entity({ schema: 'finalpj', name: 'foodsurvey' })
export class FoodSurvey {
  @PrimaryColumn()         
  @ManyToOne(() => User, user => user.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user_id: number;
  
  //@PrimaryColumn()
  @ManyToOne(() => Food, food => food.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'food_id' })
  food: number;

  @Column({ type: 'int' })
  food_like: number;

  @Column({ type: 'boolean' })
  food_preferred: boolean;
}
