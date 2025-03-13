import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EventEntity } from './event.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { PositionEntity } from './position.entity';

@Entity('staff_members')
@Index(['event', 'user', 'position'], { unique: true })
export class StaffMemberEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  salary: number;

  @Column()
  dietBudget: number;

  @Column()
  contractAttachment: string;

  @ManyToOne(() => PositionEntity, { nullable: false })
  position: PositionEntity;

  @ManyToOne(() => EventEntity, (event) => event.staffMembers, {
    nullable: false,
  })
  event: EventEntity;

  @ManyToOne(() => UserEntity, (user) => user.staffMemberAssignations, {
    nullable: false,
  })
  user: UserEntity;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
