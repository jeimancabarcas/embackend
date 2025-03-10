import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { PermissionsController } from './controllers/permissions/permissions.controller';
import { RolesController } from './controllers/roles/roles.controller';
import { PermissionEntity } from './entities/permissions.entity';
import { RoleEntity } from './entities/roles.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, PermissionEntity, RoleEntity]),
  ],
  controllers: [UsersController, PermissionsController, RolesController],
  providers: [UsersService],
})
export class UsersModule {}
