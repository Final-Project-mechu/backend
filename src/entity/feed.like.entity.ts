import { ManyToOne, JoinColumn, Entity, PrimaryColumn } from 'typeorm';
import { User } from './user.entity';
import { Feed } from './feed.entity';

@Entity({ schema: 'finalpj', name: 'feedlike' })
export class FeedLike {
  @PrimaryColumn()
  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user_id: number;

  //@PrimaryColumn()
  @ManyToOne(() => Feed)
  @JoinColumn({ name: 'feed_id' })
  feed_id: number;
}
