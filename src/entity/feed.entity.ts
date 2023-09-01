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
import { FeedLike } from './feed.like.entity';

@Entity({ schema: 'finalpj', name: 'feed' })
export class Feed {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.feeds)
  @JoinColumn({ name: 'user_id' })
  users: User;
  @Column({ type: 'int', nullable: false })
  user_id: number;

  @OneToMany(() => Favorite, favorite => favorite.feeds)
  favorites: Favorite[];
  @OneToMany(() => FeedLike, feedLike => feedLike.feed_id)
  feedLike: FeedLike[];

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
