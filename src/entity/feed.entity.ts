import { timestamp } from 'rxjs';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinColumn,
  Entity,
} from 'typeorm';
import { User } from './user.entity';
import { Favorite } from './favorite.entity';

@Entity({ schema: 'finalpj', name: 'feed' })
export class Feed {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user_id: number;

  @ManyToOne(() => Favorite)
  @JoinColumn({ name: 'favorite_id' })
  favorite_id: number;

  @Column('varchar', { length: 30 })
  title: string;

  @Column('varchar', { length: 300 })
  description: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt: Date | null;
}
