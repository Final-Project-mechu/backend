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
import { v4 as uuidv4 } from 'uuid';
import { Feed } from './feed.entity';
import { Comment } from './comment.entity';
import { Favorite } from './favorite.entity';
import { FoodUserWeight } from './food.user.weight.entity';
import { UserAction } from './user.action.entity';
import { FeedLike } from './feed.like.entity';

@Entity({ schema: 'finalpj', name: 'user' })
export class User {
  findUserByIdWithoutPassword(id: number) {
    throw new Error('Method not implemented.');
  }
  @PrimaryGeneratedColumn()
  id: number;
  @OneToMany(() => Feed, feed => feed.users)
  feeds: Feed[];
  @OneToMany(() => Comment, comment => comment.user)
  comment: Comment[];
  @OneToMany(() => Favorite, favorate => favorate.users)
  favorites: Favorite[];
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
    default: uuidv4(),
  })
  refresh_token: string;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
  @DeleteDateColumn()
  deletedAt: Date | null;
}
