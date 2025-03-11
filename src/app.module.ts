import { Module } from '@nestjs/common';
import { EventsModule } from './events/events.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { FirebaseModule } from './firebase/firebase.module';
import { LocationsModule } from './locations/locations.module';

@Module({
  imports: [
    EventsModule,
    UsersModule,
    FirebaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'root',
      password: 'admin',
      database: 'nestdb',
      autoLoadEntities: true,
      synchronize: true,
      dropSchema: true,
      retryAttempts: 2,
    }),
    LocationsModule,
  ],
})
export class AppModule {}
