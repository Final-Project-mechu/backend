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
  @PrimaryGeneratedColumn({ name: 'id'})
  id: number;

  @ApiProperty({ description: 'user_id'})
  @Column()
  user_id: number

  @ApiProperty({ description: '내용'})
  @Column()
  contents: string;

 @ApiProperty({ description: ''})


  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt: Date | null;


}
