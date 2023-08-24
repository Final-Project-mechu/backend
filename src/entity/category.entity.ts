import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity({ schema: 'finalpj', name: 'category' })
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar')
  name_top: string;

  @Column('int')
  down_category_id: number;

  @Column('varchar', { length: 10 })
  down_category_name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;
}
