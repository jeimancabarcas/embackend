import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class UserEntity {

    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    fk_roleId: number;

    @Column()
    email: string;

    @Column()
    name: string;

    @Column()
    last_name: string;

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