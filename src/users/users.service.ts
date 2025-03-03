import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(UserEntity)
  private usersRepository: Repository<UserEntity>
  ) { };

  create(createUserDto: CreateUserDto) {
    const userEntity = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(userEntity);
  }

  async findAll(): Promise<UserEntity[]> {
    const allUsers: UserEntity[] = await this.usersRepository.find();
    if (!allUsers.length)
      throw new NotFoundException('There are not users created yet');
    return allUsers;
  }

  async findOne(id: number): Promise<UserEntity> {
    const user: UserEntity = await this.validateUsersExists(id);
    return user
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.usersRepository.update(id, updateUserDto);
    return this.validateUsersExists(id);
  }

  async remove(id: number) {
    const user: UserEntity = await this.validateUsersExists(id);
    return await this.usersRepository.softRemove(user);
  }

  private async validateUsersExists(id: number): Promise<UserEntity> {
    const user: UserEntity | null = await this.usersRepository.findOneBy({
      id,
    });
    if (!user)
      throw new NotFoundException('The user requested was not found')
    return user;
  }

}


