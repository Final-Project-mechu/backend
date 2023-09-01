import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Category } from './category.entity';

@Entity({ schema: 'finalpj', name: 'food' })
export class Food {
  @PrimaryGeneratedColumn()
  food_id: number;

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'category_id' })
  category_id: number;

  @Column('varchar', { length: 20 })
  name: string;

  @Column('varchar', { length: 300 })
  ingredient: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;
}
