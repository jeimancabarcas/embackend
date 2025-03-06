import { Module, OnModuleInit } from '@nestjs/common';
import { EventsModule } from './events/events.module';
import { UsersModule } from './users/users.module';
import { InjectDataSource, TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { FirebaseModule } from './firebase/firebase.module';
import { DataSource } from 'typeorm';
import { PositionEntity } from './events/entities/position.entity';
import { UserEntity } from './users/entities/user.entity';

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
  ],
})
export class AppModule implements OnModuleInit {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async onModuleInit() {
    console.log('🔄 Ejecutando seeders...');
    await this.seedEvents();
    console.log('✅ Seeding completado');
  }
  private async seedEvents() {
    const positionRepository = this.dataSource.getRepository(PositionEntity);
    const userRepository = this.dataSource.getRepository(UserEntity);

    const positions: PositionEntity[] = [
      { name: 'Dancer', description: 'Dancer position' },
      { name: 'Dancer 1', description: 'Dancer position 1' },
      { name: 'Dancer 2', description: 'Dancer position 2' },
    ];
    await positionRepository.insert(positions);
    console.log('✅ Positions insertados correctamente');
    const users: UserEntity[] = [
      {
        name: 'Jeiman',
        lastName: 'Cabarcas',
        address: 'Test',
        birthdate: new Date(),
        email: 'jeimancabarcas@gmail.com',
      },
    ];
    await userRepository.insert(users);
    console.log('✅ Users insertados correctamente');
  }
}
