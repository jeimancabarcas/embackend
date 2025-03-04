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

@Entity('hotels')
export class HotelEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  hotelName: string;

  @Column()
  bookingCode: string;

  @Column()
  roomType: string;

  @Column()
  observations: string;

  @Column()
  checkIn: Date;

  @Column()
  checkOut: Date;

  @Column()
  attachment: string;

  @Column()
  invoice: string;

  @Column()
  cost: number;

  @ManyToOne(() => EventEntity, (event) => event.expenses)
  event: EventEntity;

  @ManyToMany(() => UserEntity, (user) => user.hotelReservations)
  @JoinTable({ name: 'hotel_guests' })
  flightPassengers?: UserEntity[];

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
