import { timestamp } from 'rxjs';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinColumn,
  Entity,
} from 'typeorm';
import { User } from './user.entity';

@Entity({ schema: 'finalpj', name: 'favorite' })
export class Favorite {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user_id: number;

  @Column('varchar', { length: 30 })
  store_name: string;

  @Column('varchar', { length: 300 })
  store_address: string;

  @Column('varchar', { length: 20 })
  store_business_hours: string;

  @Column('int')
  store_contact: number;

  @Column('varchar', { length: 20 })
  store_keyword: string;

  @Column('varchar', { length: 300 })
  store_img: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt: Date | null;
}
