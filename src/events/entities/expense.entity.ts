import { UserEntity } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EventEntity } from './event.entity';

@Entity('expenses')
export class ExpenseEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  description: string;

  @Column()
  attachment: string;

  @Column()
  invoice: string;

  @Column()
  cost: number;

  @ManyToOne(() => EventEntity, (event) => event.expenses)
  event: EventEntity;

  @ManyToOne(() => UserEntity, (user) => user.expenses)
  user?: UserEntity;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
