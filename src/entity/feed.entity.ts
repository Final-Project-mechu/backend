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
import { FeedLike } from './feed.like.entity';
import { FeedFavorite } from './feed.favorite.entity';

@Entity({ schema: 'finalpj', name: 'feed' })
export class Feed {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.feeds)
  @JoinColumn({ name: 'user_id' })
  users: User;
  @Column({ type: 'int', nullable: false })
  user_id: number;

  @OneToMany(() => FeedFavorite, feedFavorite => feedFavorite.feed_id)
  feedFavorites: FeedFavorite[];
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
