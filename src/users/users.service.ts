import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { admin } from '../config/firebase.config';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const userRecord = await admin.auth().createUser({
    email: createUserDto.email,
    password: createUserDto.password
   })

    const userEntity = this.usersRepository.create({
      id: userRecord.uid,
      address: createUserDto.address,
      birthdate: createUserDto.birthdate,
      email:createUserDto.email,
      name:createUserDto.name,
      lastName:createUserDto.lastName,
      password:createUserDto.password
    });
    return this.usersRepository.save(userEntity);
  }

  async findAll(): Promise<UserEntity[]> {
    const allUsers: UserEntity[] = await this.usersRepository.find();
    if (!allUsers.length)
      throw new NotFoundException('There are not users created yet');
    return allUsers;
  }

  async findOne(id: string): Promise<UserEntity> {
    const user: UserEntity = await this.validateUsersExists(id);
    return user;
  }

  

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.usersRepository.update(id, updateUserDto);
    return this.validateUsersExists(id);
  }

  async remove(id: string) {
    const user: UserEntity = await this.validateUsersExists(id);
    return await this.usersRepository.softRemove(user);
  }

  private async validateUsersExists(id: string): Promise<UserEntity> {
    const user: UserEntity | null = await this.usersRepository.findOneBy({
      id,
    });
    if (!user) throw new NotFoundException('The user requested was not found');
    return user;
  }
}
