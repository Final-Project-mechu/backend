import {
  Entity,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
  Column,
} from 'typeorm';
import { Food } from './food.entity';
import { User } from './user.entity';

@Entity({ schema: 'finalpj', name: 'food_survey' })
export class FoodSurvey {
  @PrimaryColumn()         
  @ManyToOne(() => User, user => user.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user_id: number;
  
  @PrimaryColumn()
  @ManyToOne(() => Food, food => food.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'food_id' })
  food_id: number;

  @Column('int', {nullable: true})
  food_like: number | null;

  @Column('boolean', { nullable: true})
  food_preferred: boolean | null;
}
