import {
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Food } from './food.entity';

@Entity({ schema: 'finalpj', name: 'foodimg' })
export class FoodImg {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Food)
  @JoinColumn({ name: 'food_id' })
  food_id: number;
}
