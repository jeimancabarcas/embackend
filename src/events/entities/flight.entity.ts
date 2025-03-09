import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EventEntity } from './event.entity';
import { UserEntity } from 'src/users/entities/user.entity';

@Entity('flights')
export class FlightEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  flightNumber: string;

  @Column()
  bookingCode: string;

  @Column()
  airline: string;

  @Column()
  departure: Date;

  @Column()
  arrival: Date;

  @Column()
  observations: string;

  @Column()
  cost: number;

  @Column()
  invoice: string;

  @ManyToOne(() => EventEntity, (event) => event.expenses)
  event: EventEntity;

  @ManyToMany(() => UserEntity, (user) => user.flightReservations)
  @JoinTable({ name: 'flight_passengers' })
  flightPassengers?: UserEntity[];

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
