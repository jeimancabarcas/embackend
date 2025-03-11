import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CountryEntity } from './entities/country.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LocationsService {
  constructor(
    @InjectRepository(CountryEntity)
    private countriesRepository: Repository<CountryEntity>,
  ) {}

  async findAll() {
    const countries: CountryEntity[] = await this.countriesRepository.find({
      relations: ['cities'],
    });
    if (!countries?.length) throw new NotFoundException(`Countries not found.`);
    return countries;
  }
}
