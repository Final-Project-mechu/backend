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
import { ApiProperty } from '@nestjs/swagger';

@Entity({ schema: 'finalpj', name: 'comment' })
export class Comment {
  @PrimaryColumn()
  id: number;

  @ApiProperty({ description: '내용'})
  @Column()
  comment: string;

  @CreateDateColumn()
  createdAt: Date;
  
  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt: Date | null;


}
