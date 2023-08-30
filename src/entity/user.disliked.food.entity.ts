import {
  Entity,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Food } from './food.entity';

@Entity({ schema: 'finalpj', name: 'user_disliked_food' })
export class UserDislikedFood {
  @PrimaryColumn()
  @ManyToOne(() => User, user => user.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user_id: User;

  @PrimaryColumn()
  @ManyToOne(() => Food, food => food.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'food_id' })
  food_id: Food;
}


