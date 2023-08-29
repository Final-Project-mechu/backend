import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Friends } from './friend.entity';

@Entity({ schema: 'finalpj', name: 'friendlist' })
export class Friendlist {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Friends)
  @JoinColumn({ name: 'friend_id' })
  friend_id: number;

  @Column('varchar')
  receiver_user_id: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt: Date | null;
}
