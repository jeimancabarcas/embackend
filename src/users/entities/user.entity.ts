import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PermissionEntity } from './permissions.entity';
import { RoleEntity } from './roles.entity';
import { StaffMemberEntity } from 'src/events/entities/staff-member.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  email: string;

  @Column()
  name: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column()
  birthdate: Date;

  @Column()
  address: string;

  @OneToMany(() => StaffMemberEntity, (staffMember) => staffMember.user)
  staffMemberAssignations: StaffMemberEntity[];

  @ManyToMany(() => PermissionEntity)
  @JoinTable({ name: 'users_permissions' })
  permissions: PermissionEntity[];

  @ManyToMany(() => RoleEntity)
  @JoinTable({ name: 'users_roles' })
  roles: RoleEntity[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt?: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt?: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;
}
