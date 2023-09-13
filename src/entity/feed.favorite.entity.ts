import {
  ManyToOne,
  JoinColumn,
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Feed } from './feed.entity';
import { Favorite } from './favorite.entity';

@Entity({ schema: 'finalpj', name: 'feed_favorite' })
export class FeedFavorite {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Feed, feed => feed.feedFavorites)
  @JoinColumn({ name: 'feed_id' })
  feed_id: number;

  @ManyToOne(() => Favorite, favorite => favorite.feedFavorite)
  @JoinColumn({ name: 'favorite_id' })
  favorite_id: number;
}
