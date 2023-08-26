import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ schema: 'finalpj', name: 'ingredient' })
export class Ingredient {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  ingredient_name: string;
}

//
