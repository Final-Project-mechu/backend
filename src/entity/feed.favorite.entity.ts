import { ManyToOne, JoinColumn, Entity, PrimaryColumn } from 'typeorm';
import { Feed } from './feed.entity';
import { Favorite } from './favorite.entity';

@Entity({ schema: 'finalpj', name: 'feed_favorite' })
export class FeedFavorite {
  @PrimaryColumn()
  @ManyToOne(() => Feed)
  @JoinColumn({ name: 'feed_id' })
  feed_id: number;

  @PrimaryColumn()
  @ManyToOne(() => Favorite)
  @JoinColumn({ name: 'favorite_id' })
  favorite_id: number;
}
