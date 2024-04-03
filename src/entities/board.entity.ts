import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'board' })
export class Board extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'id', comment: 'PK' })
  id: number;

  @Column({ name: 'title', comment: 'title' })
  title: string;

  @Column({ name: 'content', comment: 'content' })
  content: string;

  @CreateDateColumn({ name: 'created_at', comment: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at', comment: 'updated_at' })
  updated_at: Date;

  @DeleteDateColumn({ name: 'deleted_at', comment: 'deleted_at' })
  deleted_at: Date;

  @ManyToOne(() => User, (user) => user.boards)
  user: User;
}
