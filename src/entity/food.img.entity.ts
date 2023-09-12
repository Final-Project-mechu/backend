import {
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  Column
} from 'typeorm';
import { Food } from './food.entity';

@Entity({ schema: 'finalpj', name: 'food_img' })
export class FoodImags {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  filename: string;

  @Column()
  url: string;

  @OneToOne(() => Food)
  @JoinColumn({ name: 'food_id' })
  food_id: number;
}
