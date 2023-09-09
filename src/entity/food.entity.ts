import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Category } from './category.entity';

@Entity({ schema: 'finalpj', name: 'food' })
export class Food {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  food_name: string;

  @ManyToOne(() => Category, category => category.id)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column()
  category_id: number;

  @Column()
  food_img: string | null ;

  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt: Date | null;

  
}