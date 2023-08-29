import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Feed } from './feed.entity';
import { Comment } from './comment.entity';
import { Favorite } from './favorite.entity';
import { FoodUserWeight } from './food.user.weight.entity'; 
import { UserAction } from './user.action';
import { FeedLike } from './feed.like.entity';

@Entity({ schema: 'finalpj', name: 'user' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @OneToMany(() => Feed, feed => feed.user_id)
  feed: Feed[];
  @OneToMany(() => Comment, comment => comment.user_id)
  comment: Comment[];
  @OneToMany(() => Favorite, favorate => favorate.user_id)
  favorite: Favorite[];
  @OneToMany(() => FoodUserWeight, foodUserWeight => foodUserWeight.user_id)
  foodUserWeight: FoodUserWeight[];
  @OneToMany(() => UserAction, userAction => userAction.user_id)
  userAction: UserAction[];
  @OneToMany(() => FeedLike, feedLike => feedLike.user_id)
  feedLike: FeedLike[];
  @Index({ unique: true })
  @Column('varchar')
  email: string;
  @Column('int')
  is_admin: number;
  @Column('varchar', { length: 10 })
  nick_name: string;
  @Column('varchar', { select: false })
  password: string;
  @Column('varchar', {
    select: false,
    default: 'your_default_refresh_token_value',
  })
  refresh_token: string;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
  @DeleteDateColumn()
  deletedAt: Date | null;
}
