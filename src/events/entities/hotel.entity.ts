import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

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

  @CreateDateColumn({ name: 'created_at' })
  createdAt?: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt?: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;
}
