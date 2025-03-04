import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

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

  @CreateDateColumn({ name: 'created_at' })
  createdAt?: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt?: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;
}
