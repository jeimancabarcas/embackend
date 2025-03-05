import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { StaffMemberEntity } from './staff-member.entity';
import { ExpenseEntity } from './expense.entity';
import { FlightEntity } from './flight.entity';
import { HotelEntity } from './hotel.entity';

@Entity('events')
export class EventEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  name: string;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column()
  venue: string;

  @Column()
  country: string;

  @Column()
  city: string;

  @OneToMany(() => StaffMemberEntity, (staffMember) => staffMember.event)
  staffMembers?: StaffMemberEntity[];

  @OneToMany(() => ExpenseEntity, (expense) => expense.event)
  expenses?: ExpenseEntity[];

  @OneToMany(() => FlightEntity, (flight) => flight.event)
  flights?: FlightEntity[];

  @OneToMany(() => HotelEntity, (hotel) => hotel.event)
  hotels?: HotelEntity[];

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
