import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ schema: 'finalpj', name: 'category' })
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 255 })
  category_name: string;

  @Column('int', { nullable: true })
  top_category_id: number | null;
}
