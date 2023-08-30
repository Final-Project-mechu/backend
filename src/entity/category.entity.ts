import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ schema: 'finalpj', name: 'category' })
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

<<<<<<< HEAD
  @Column('varchar', { length: 255 })
  category_name: string;

  @Column('int', { nullable: true })
  top_category_id: number | null;
}
=======
  @Column('varchar', { length: 10 })
  name_top: string;

  @Column('int')
  down_category_id: number;

  @Column('varchar', { length: 10 })
  down_category_name: string;
}
>>>>>>> af7063dd0398e34ee95d4051967b3e39839eebff
