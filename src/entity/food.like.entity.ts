import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinColumn,
  RelationId,
  Entity,
  PrimaryColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Food } from './food.entity';

@Entity({ schema: 'finalpj', name: 'foodlike' })
export class FoodLike {
  //user 테이블에서 참조
  @PrimaryColumn()
  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user_id: number;
  //food 테이블에서 참조
  @PrimaryColumn()
  @ManyToOne(() => Food)
  @JoinColumn({ name: 'food_id' })
  food_id: number;

  @Column('int')
  preference: number;
}
