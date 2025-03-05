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
import { ExpenseEntity } from 'src/events/entities/expense.entity';
import { HotelEntity } from 'src/events/entities/hotel.entity';
import { FlightEntity } from 'src/events/entities/flight.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  email: string;

  @Column()
  name: string;

  @Column()
  lastName: string;

  @Column()
  birthdate: Date;

  @Column()
  address: string;

  @OneToMany(() => StaffMemberEntity, (staffMember) => staffMember.user)
  staffMemberAssignations?: StaffMemberEntity[];

  @OneToMany(() => ExpenseEntity, (expense) => expense.user)
  expenses?: ExpenseEntity[];

  @ManyToMany(() => PermissionEntity)
  @JoinTable({ name: 'users_permissions' })
  permissions?: PermissionEntity[];

  @ManyToMany(() => RoleEntity)
  @JoinTable({ name: 'users_roles' })
  roles: RoleEntity[];

  @ManyToMany(() => HotelEntity)
  hotelReservations: HotelEntity[];

  @ManyToMany(() => FlightEntity)
  flightReservations: FlightEntity[];

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
