import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { StaffMemberEntity } from './staff-member.entity';
import { ExpenseEntity } from './expense.entity';
import { FlightEntity } from './flight.entity';
import { HotelEntity } from './hotel.entity';
import { CountryEntity } from 'src/locations/entities/country.entity';
import { CityEntity } from 'src/locations/entities/city.entity';

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

  @ManyToOne(() => CountryEntity)
  country: CountryEntity;

  @ManyToOne(() => CityEntity)
  city: CityEntity;

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
