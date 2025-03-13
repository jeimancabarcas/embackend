import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as admin from 'firebase-admin';
import { UserRecord } from 'firebase-admin/lib/auth/user-record';

@Injectable()
export class UsersService {
  constructor(
    @Inject('FIREBASE_ADMIN') private readonly authAdmin: admin.app.App,
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    let userFirebase: UserRecord | null = null;
    try {
      userFirebase = await this.authAdmin.auth().createUser({
        email: createUserDto.email,
        password: createUserDto.password,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
    try {
      const userEntity: UserEntity = this.usersRepository.create({
        idFirebase: userFirebase.uid,
        ...createUserDto,
      });
      return this.usersRepository.save(userEntity);
    } catch {
      if (userFirebase?.uid)
        await this.authAdmin.auth().deleteUser(userFirebase.uid);
      throw new InternalServerErrorException(
        'An error occured while saving the user',
      );
    }
  }

  async findAll(): Promise<UserEntity[]> {
    const allUsers: UserEntity[] = await this.usersRepository.find({
      relations: ['permissions'],
    });
    if (!allUsers.length)
      throw new NotFoundException('There are not users created yet');
    return allUsers;
  }

  async findOne(id: number): Promise<UserEntity> {
    const user: UserEntity = await this.validateUsersExists(id);
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const filterUser = Object.fromEntries(
      Object.entries(updateUserDto).filter(
        ([Key, value]) => value !== undefined && Key !== 'permissions',
      ),
    );
    const user: UserEntity = await this.validateUsersExists(id);
    try {
      await this.usersRepository.update(id, filterUser);
      await this.authAdmin.auth().updateUser(user.idFirebase, {
        email: updateUserDto.email,
      });
      return this.validateUsersExists(id);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async remove(id: number) {
    const user: UserEntity = await this.validateUsersExists(id);
    try {
      await this.authAdmin.auth().deleteUser(user.idFirebase);
      return await this.usersRepository.softRemove(user);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  private async validateUsersExists(id: number): Promise<UserEntity> {
    const user: UserEntity | null = await this.usersRepository.findOne({
      where: { id },
      relations: ['permissions'],
    });
    if (!user) throw new NotFoundException('The user requested was not found');
    return user;
  }
}
