import { Module } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { LocationsController } from './locations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CountryEntity } from './entities/country.entity';
import { CityEntity } from './entities/city.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CountryEntity, CityEntity])],
  controllers: [LocationsController],
  providers: [LocationsService],
})
export class LocationsModule {}
