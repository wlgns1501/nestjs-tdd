import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Board } from './board.entity';

@Entity()
@Unique(['email'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn({ comment: 'PK', name: 'id' })
  id: number;

  @Column({ comment: 'name', name: 'name' })
  name: string;

  @Column({ comment: 'email', name: 'email' })
  email: string;

  @Column({ comment: 'password', name: 'password' })
  password: string;

  @CreateDateColumn({ comment: 'createdAt', name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ comment: 'updatedAt', name: 'updated_at' })
  updated_at: Date;

  @OneToMany(() => Board, (board) => board.user)
  boards: Board[];
}
