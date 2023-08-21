import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';

@Entity({ schema: 'finalpj', name: 'note' })
export class Note {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;
  @Column('text', { name: 'content' })
  content: string;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
