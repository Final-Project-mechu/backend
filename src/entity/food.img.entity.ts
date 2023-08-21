import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Food } from './food.entity';

@Entity({ schema: 'finalpj', name: 'foodimg' })
export class Foodimg {
  @PrimaryGeneratedColumn()
  food_img_id: number;

  @OneToOne(() => Food)
  @JoinColumn({ name: 'food_id' })
  food_id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;
}
