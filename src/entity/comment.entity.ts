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
  @PrimaryColumn()
  id: number;

  @Column()
  comment: string;

  @CreateDateColumn()
  createdAt: Date;
  
  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt: Date | null;

  @PrimaryColumn()
  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user_id: number;

  @PrimaryColumn()
  @ManyToOne(() => Feed)
  @JoinColumn({ name: 'feed_id' })
  feed_id: number;
}
