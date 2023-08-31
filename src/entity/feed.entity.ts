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
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { Favorite } from './favorite.entity';

@Entity({ schema: 'finalpj', name: 'feed' })
export class Feed {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.feeds)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Favorite, favorite => favorite.feeds)
  favorites: Favorite[];

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
