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

@Injectable()
export class UsersService {
  constructor(
    @Inject('FIREBASE_ADMIN') private readonly authAdmin: admin.app.App,
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const userFirebase = await this.authAdmin.auth().createUser({
      email: createUserDto.email,
      password: createUserDto.password,
    });
    try {
      const userEntity: UserEntity = this.usersRepository.create({
        idFirebase: userFirebase.uid,
        ...createUserDto,
      });
      return this.usersRepository.save(userEntity);
    } catch (error) {
      await this.authAdmin.auth().deleteUser(userFirebase.uid);
      throw new InternalServerErrorException(error.message);
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
    const user: UserEntity = await this.validateUsersExists(id);
    user.permissions = updateUserDto.permissions as any;
    await this.usersRepository.save(user);
    return this.validateUsersExists(id);
  }

  async remove(id: number) {
    const user: UserEntity = await this.validateUsersExists(id);
    return await this.usersRepository.softRemove(user);
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
