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

@Entity({ schema: 'finalpj', name: 'favorate' })
export class Favorate {
  @PrimaryGeneratedColumn()
  favorate_id: number;

  // @ManyToOne(() => User)
  // @JoinColumn({ name: 'user_id' })
  // user_id: number;

  @Column('varchar', { length: 30 })
  address_name: string;

  @Column('varchar', { length: 300 })
  road_address_name: string;

  @Column('varchar', { length: 20 })
  kakao_id: number;

  @Column('int')
  category_name: string;

  @Column('varchar', { length: 20 })
  phone: string;

  @Column('varchar', { length: 300 })
  place_name: string;

  @Column('varchar', { length: 300 })
  place_url: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt: Date | null;
}
