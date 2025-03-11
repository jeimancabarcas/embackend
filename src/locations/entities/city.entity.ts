import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { CountryEntity } from './country.entity';

@Entity('cities')
export class CityEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => CountryEntity, (country) => country.cities)
  country: CountryEntity;
}
