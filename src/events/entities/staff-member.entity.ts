import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EventEntity } from './event.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { PositionEntity } from './position.entity';

@Entity('staff_members')
export class StaffMemberEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  salary: number;

  @Column()
  dietButget: number;

  @Column()
  contractAttachment: string;

  @OneToOne(() => PositionEntity)
  @JoinColumn()
  position: PositionEntity;

  @ManyToOne(() => EventEntity, (event) => event.staffMembers)
  event?: EventEntity;

  @ManyToOne(() => UserEntity, (user) => user.staffMemberAssignations)
  user?: UserEntity;

  @CreateDateColumn({ name: 'created_at' })
  createdAt?: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt?: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;
}
