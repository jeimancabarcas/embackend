import { IsNotEmpty, IsString } from 'class-validator';
import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    PrimaryColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class UserEntity {

    @PrimaryColumn()
    id?: string;

    @Column()
    password: string

    @Column()
    email: string;

    @Column()
    name: string;

    @Column({name: 'last_name'})
    lastName: string;

    @Column()
    birthdate: Date;

    @Column()
    address: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt?: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt?: Date;

    @DeleteDateColumn({ name: 'deleted_at' })
    deletedAt?: Date;
}