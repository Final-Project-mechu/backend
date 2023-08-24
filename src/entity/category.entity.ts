import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';

@Entity({ schema: 'finalpj', name: 'category' })
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 10 } )
  name_top: string;

  @Column('int')
  down_category_id: number;

  @Column('varchar', { length: 10 })
  down_category_name: string;

}
