import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  PrimaryColumn,
  DeleteDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Feed } from './feed.entity';

@Entity({ schema: 'finalpj', name: 'comment' })
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nick_name: string;

  @Column()
  contents: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt: Date | null;

  @ManyToOne(() => User, user => user.comment)
  @JoinColumn({ name: 'user_id' })
  user_id: number;
  user: User;  // 추가된 속성

  @ManyToOne(() => Feed)
  @JoinColumn({ name: 'feed_id' })
  feed_id: number;
}
