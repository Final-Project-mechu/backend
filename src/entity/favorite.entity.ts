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
  PrimaryColumn,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { FeedFavorite } from './feed.favorite.entity';

@Entity({ schema: 'finalpj', name: 'favorite' })
export class Favorite {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.favorites)
  @JoinColumn({ name: 'user_id' })
  users: number;

  @OneToMany(() => FeedFavorite, feedFavorite => feedFavorite.favorite_id)
  @JoinColumn({ name: 'favorite_id' })
  feedFavorite: FeedFavorite[] | null;

  @Column('varchar', { length: 30 })
  address_name: string;

  @Column('varchar', { length: 300 })
  road_address_name: string;

  @Column('varchar', { length: 20 })
  kakao_id: number;

  @Column('varchar', { length: 300 })
  category_name: string;

  @Column('varchar', { length: 20 })
  phone: string;

  @Column('varchar', { length: 300 })
  place_name: string;

  @Column('varchar', { length: 300 })
  place_url: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt: Date | null;
}